<script setup>
import * as d3 from 'd3'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from 'vuetify'
import { getWeekRange } from '@/helpers/dateTimeHelper'
import { useI18n } from 'vue-i18n'

const theme = useTheme()
const { t } = useI18n()

// ✅ Props
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

// ✅ Legend cấu hình
const legends = [
  { key: 'attendance', label: t('chart.worshipService'), color: theme.current.value.colors.chartAttendance },
  { key: 'cellGroup', label: t('chart.cellGroup'), color: theme.current.value.colors.chartCellGroup },
  { key: 'prayerMeeting', label: t('chart.prayerMeeting'), color: theme.current.value.colors.chartPrayerMeeting },
  { key: 'liwClass', label: t('chart.liwClasses'), color: theme.current.value.colors.chartLiwClass },
]

const chartContainer = ref(null)
const hiddenLines = ref(new Set())

const formatDomain = (d) => {
  // const [start, end] = getWeekRange(d.year, d.week, 'DD MMM')
  return `W${d.week}.${d.year}`
}

const formatTooltipContent = (legend, d) => {
  const val = d.value ? d.value : 'No data'
  return `
    <div style="line-height: 1.5">
    <b>${legend.label}</b><br>
    <b>${t('chart.week')}</b>: W${d.week}.${d.year} (${d.startDate} - ${d.endDate})<br>
    <b>${t('chart.attendance')}</b>: ${val}
    </div>
  `;
}

function toggleLine(key) {
  if (hiddenLines.value.has(key)) hiddenLines.value.delete(key)
  else hiddenLines.value.add(key)
  drawChart()
}

// ✅ Watch dữ liệu từ API → vẽ lại chart
watch(
  () => props.data,
  async (newData) => {
    if (!newData || !newData.length) return
    await nextTick()
    drawChart()
  },
  { deep: true, immediate: true }
)

// ✅ Watch khi ẩn/hiện line
watch(hiddenLines, () => nextTick(drawChart), { deep: true })

// ✅ Vẽ lại khi resize
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
function handleResize() {
  nextTick(drawChart)
}

function drawChart() {
  const data = props.data
  const container = chartContainer.value
  if (!container || !data?.length) return

  // Clear old chart
  d3.select(container).selectAll('*').remove()
  d3.select('body').selectAll('.d3-tooltip').remove()

  const margin = { top: 20, right: 20, bottom: 60, left: 50 }
  const width = container.clientWidth - margin.left - margin.right
  const height = container.clientHeight - margin.top - margin.bottom

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // ✅ X scale
  const x = d3
    .scalePoint()
    .domain(data.map(formatDomain))
    .range([0, width])
    .padding(0.5)

  // ✅ Y scale
  const maxY = d3.max(data, (d) =>
    d3.max(legends.map((l) => d[l.key] || 0))
  )
  const y = d3.scaleLinear().domain([0, maxY]).nice().range([height, 0])

  // ✅ Giảm tick cho trục X
  const xTickValues = x.domain().filter((_, i) => i % 4 === 0)

  // ✅ Grid lines Y
  svg
    .append('g')
    .attr('class', 'grid grid-y')
    .call(
      d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat('')
    )
    .selectAll('line')
    .attr('stroke', '#ddd')
    .attr('stroke-opacity', 0.5)

  // ✅ Grid lines X
  svg
    .append('g')
    .attr('class', 'grid grid-x')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat('')
        .tickValues(xTickValues)
    )
    .selectAll('line')
    .attr('stroke', '#eee')
    .attr('stroke-opacity', 0.5)

  // ✅ Axes
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(xTickValues)
        // .tickFormat(d => {
        // })
    )
    .selectAll('text')
    .attr('transform', 'rotate(-20)')
    .style('text-anchor', 'end')
    .style('font-size', '11px')

  svg.append('g').call(d3.axisLeft(y))

  // ✅ Tooltip
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'd3-tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(0,0,0,0.75)')
    .style('color', '#fff')
    .style('padding', '6px 8px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('transition', 'opacity 0.2s')

  // ✅ Line generator
  const line = d3
    .line()
    .defined((d) => d.value != null)
    .x((d) => x(d.key))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)

  // ✅ Draw lines
  legends.forEach((legend) => {
    if (hiddenLines.value.has(legend.key)) return

    const lineData = data.map((d) => {
      const [start, end] = getWeekRange(d.year, d.week, 'DD MMM')
      
      return {
        key: formatDomain(d),
        week: d.week,
        year: d.year,
        startDate: start,
        endDate: end,
        value: d[legend.key],
      }
  })

    // Path line
    svg
      .append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', legend.color)
      .attr('stroke-width', 2)
      .attr('d', line)

    // Dots
    svg
      .selectAll(`.dot-${legend.key}`)
      .data(lineData)
      .enter()
      .append('circle')
      .attr('class', `dot-${legend.key}`)
      .attr('cx', (d) => x(d.key))
      .attr('cy', (d, i, arr) => {
        if (d.value != null) return y(d.value)
        const prev = arr[i - 1] ? arr[i - 1].__data__?.value : null
        const next = arr[i + 1] ? arr[i + 1].__data__?.value : null
        const refValue = prev ?? next ?? 0
        return y(refValue)
      })
      .attr('r', (d) => (d.value == null ? 3 : 4))
      .attr('fill', legend.color)
      .style('opacity', (d) => (d.value == null ? 0.3 : 1))
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        tooltip
          .style('opacity', 1)
          .html(
            formatTooltipContent(legend, d)
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 28 + 'px')
      })
      .on('mouseleave', () => tooltip.style('opacity', 0))
  })
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

<style>
.d3-tooltip {
  font-family: Roboto, sans-serif;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>

<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">{{ title }}</span>
      <div class="d-flex flex-row flex-wrap justify-end">
        <div
          v-for="legend in legends"
          :key="legend.key"
          class="d-flex align-center mr-3 cursor-pointer"
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
          ></div>
          <span
            class="text-caption"
            :style="{ opacity: hiddenLines.has(legend.key) ? 0.3 : 1 }"
          >
            {{ legend.label }}
          </span>
        </div>
      </div>
    </v-card-title>

    <v-card-text>
      <div v-if="!props.data?.length" class="text-center pa-8 text-grey">
        Loading chart data...
      </div>
      <div v-else ref="chartContainer" style="width: 100%; height: 400px;"></div>
    </v-card-text>
  </v-card>
</template>
