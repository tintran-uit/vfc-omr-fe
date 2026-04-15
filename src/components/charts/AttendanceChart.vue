<script setup>
import * as d3 from 'd3'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from 'vuetify'
import { formatDate, getISOWeekRange } from '@/helpers/dateTimeHelper'
import { useI18n } from 'vue-i18n'

const theme = useTheme()
const { t } = useI18n()

/* ================== PROPS ================== */
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: 'Attendance',
  },
})

/* ================== LEGEND ================== */
const legends = [
  { key: 'attendance', label: t('chart.worshipService'), color: theme.current.value.colors.chartAttendance },
  { key: 'cellGroup', label: t('chart.cellGroup'), color: theme.current.value.colors.chartCellGroup },
  { key: 'prayerMeeting', label: t('chart.prayerMeeting'), color: theme.current.value.colors.chartPrayerMeeting },
  { key: 'liwClass', label: t('chart.liwClasses'), color: theme.current.value.colors.chartLiwClass },
]

const chartContainer = ref(null)
const hiddenLines = ref(new Set())

const MIN_POINT_WIDTH = 64 // px / point → chỉnh tùy thích
const isMobile = ref(false)

function updateBreakpoint() {
  isMobile.value = window.innerWidth < 768
}

const formatTooltipContent = (legend, d) => {
  const val = d.value ? d.value : 'No data'
  return `
    <div style="line-height: 1.5">
      <div class="mb-1"><b>${legend.label}</b></div>
      ${t('chart.weekEnding')}: <b>${d.xLabel}</b><br>
      ${t('chart.attendance')}: <b>${val}</b>
    </div>
  `
}

function toggleLine(key) {
  hiddenLines.value.has(key)
    ? hiddenLines.value.delete(key)
    : hiddenLines.value.add(key)

  drawChart()
}

/* ================== WATCH ================== */
watch(
  () => props.data,
  async (val) => {
    if (!val?.length) return
    await nextTick()
    drawChart()
  },
  { deep: true, immediate: true }
)

watch(hiddenLines, () => nextTick(drawChart), { deep: true })

/* ================== RESIZE ================== */
onMounted(() => {
  updateBreakpoint()
  window.addEventListener('resize', updateBreakpoint)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateBreakpoint)
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  nextTick(drawChart)
}

/* ================== DRAW CHART ================== */
function drawChart() {
  const data = props.data
  const container = chartContainer.value
  if (!container || !data?.length) return

  const normalizedData = data.map(d => {
    const [startDate, endDate] = getISOWeekRange(d.year, d.week)

    return {
      ...d,
      xKey: `${d.year}-W${d.week}`,
      xLabel: formatDate(endDate, 'DD MMM ’YY'),
      startDate: startDate,
      endDate: endDate,
    }
  })

  d3.select(container).selectAll('*').remove()

  const margin = { top: 20, right: 20, bottom: 60, left: 50 }
  const height = 400 - margin.top - margin.bottom
  
  const wrapperWidth = container.parentElement.clientWidth
  const contentWidth = isMobile.value
    ? Math.max(data.length * MIN_POINT_WIDTH, wrapperWidth)
    : wrapperWidth
  const width = contentWidth - margin.left - margin.right

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', contentWidth)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  /* ===== SCALE ===== */
  const x = d3
    .scalePoint()
    .domain(normalizedData.map(d => d.xKey))
    .range([0, width])
    .padding(0.5)

  const maxY = d3.max(data, (d) =>
    d3.max(legends.map((l) => d[l.key] || 0))
  )

  const y = d3.scaleLinear().domain([0, maxY]).nice().range([height, 0])

  const xTickValues = x.domain().filter((_, i) => i % 4 === 0)

  /* ===== GRID ===== */
  svg
    .append('g')
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(''))
    .selectAll('line')
    .attr('stroke', '#ddd')
    .attr('stroke-opacity', 0.5)

  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickSize(-height)
        .tickFormat('')
        .tickValues(xTickValues)
    )
    .selectAll('line')
    .attr('stroke', '#eee')
    .attr('stroke-opacity', 0.5)

  /* ===== AXIS ===== */
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3.axisBottom(x)
      .tickValues(xTickValues)
      .tickFormat(key => {
        const found = normalizedData.find(d => d.xKey === key)
        return found ? found.xLabel : ''
      })
    )
    .selectAll('text')
    .attr('transform', 'rotate(-20)')
    .style('text-anchor', 'end')
    .style('font-size', '11px')

  svg.append('g').call(d3.axisLeft(y))

  /* ===== TOOLTIP (GIỮ NGUYÊN LOGIC) ===== */
  let tooltip = d3.select('body').select('.d3-tooltip-global')
  if (tooltip.empty()) {
    tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'd3-tooltip-global')
      .style('position', 'fixed')
      .style('z-index', 999999)
      .style('pointer-events', 'none')
      .style('background', 'rgba(0,0,0,0.75)')
      .style('color', '#fff')
      .style('padding', '6px 8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('opacity', 0)
      .style('transition', 'opacity 0.2s')
  }

  const line = d3
    .line()
    .defined((d) => d.value != null && d.value !== 0)
    .x((d) => x(d.key))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)

  /* ===== DRAW LINES ===== */
  legends.forEach((legend) => {
    if (hiddenLines.value.has(legend.key)) return

    const lineData = normalizedData.map(d => ({
      key: d.xKey,
      week: d.week,
      year: d.year,
      startDate: d.startDate,
      endDate: d.endDate,
      xLabel: d.xLabel,
      value: d[legend.key],
    }))

    svg
      .append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', legend.color)
      .attr('stroke-width', 2)
      .attr('d', line)

    svg
      .selectAll(`.dot-${legend.key}`)
      .data(lineData)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.key))
      .attr('cy', (d, i, arr) => {
        if (d.value != null && d.value !== 0) return y(d.value)

        // Tìm điểm trước hợp lệ
        let prev = null
        for (let j = i - 1; j >= 0; j--) {
          const val = arr[j].__data__?.value
          if (val != null && val !== 0) {
            prev = val
            break
          }
        }

        // Tìm điểm sau hợp lệ
        let next = null
        for (let j = i + 1; j < arr.length; j++) {
          const val = arr[j].__data__?.value
          if (val != null && val !== 0) {
            next = val
            break
          }
        }

        // Lấy giá trị tham chiếu trung bình giữa prev & next
        const refValue =
          prev != null && next != null
            ? (prev + next) / 2
            : prev ?? next ?? 0

        return y(refValue)
      })
      .attr('r', (d) => (d.value ? 2.5 : 2.5))
      .attr('fill', legend.color)
      .style('opacity', (d) => (d.value ? 1 : 0.3))
      .style('cursor', 'pointer')
      .on('mouseenter', (e, d) => {
        tooltip
          .style('opacity', 1)
          .html(formatTooltipContent(legend, d))
          .style('left', `${e.clientX + 10}px`)
          .style('top', `${e.clientY - 28}px`)
      })
      .on('mouseleave', () => tooltip.style('opacity', 0))
  })
}
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h5">{{ title }}</span>
    </v-card-title>

    <v-card-text>
      <div class="d-flex flex-row flex-wrap justify-end chart-legends">
        <div
          v-for="legend in legends"
          :key="legend.key"
          class="d-flex align-center mr-3 cursor-pointer legend-item"
          @click="toggleLine(legend.key)"
        >
          <div
            class="mr-1"
            :style="{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: legend.color,
              opacity: hiddenLines.has(legend.key) ? 0.3 : 1,
            }"
          />
          <span
            class="text-caption"
            :style="{ opacity: hiddenLines.has(legend.key) ? 0.3 : 1 }"
          >
            {{ legend.label }}
          </span>
        </div>
      </div>
      
      <div v-if="!props.data?.length" class="text-center pa-8 text-grey">
        Loading chart data...
      </div>

      <!-- SCROLL WRAPPER -->
      <div class="chart-scroll-wrapper">
        <div ref="chartContainer" class="chart-inner"></div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chart-scroll-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.chart-inner {
  height: 400px;
  min-width: 100%;
}

@media (max-width: 767px) {
  .chart-legends .legend-item {
    width: 100%;
    margin-right: 0 !important;
  }
}
</style>
