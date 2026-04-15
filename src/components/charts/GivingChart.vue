<script setup lang="ts">
import * as d3 from 'd3'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from 'vuetify'
import { formatDate, getISOWeekRange } from '@/helpers/dateTimeHelper'
import { useI18n } from 'vue-i18n'
import { formatNumber } from '@/helpers/appHelper'

const theme = useTheme()

// ✅ Props (GIỮ NGUYÊN)
const props = withDefaults(
  defineProps<{
    data: any[]
    title?: string
  }>(),
  { title: 'Giving graph' }
)

const { t } = useI18n()

// ✅ Legend (GIỮ NGUYÊN 100%)
const legends = [
  { key: 'givingUsd', label: t('chart.legendTithesAndOfferings'), color: theme.current.value.colors.chartGiving },
  { key: 'mfpUsd', label: t('chart.legendMissionsMFPGiving'), color: theme.current.value.colors.chartMfp },
]

const chartContainer = ref<HTMLElement | null>(null)
const hiddenLines = ref(new Set<string>())

// ===== CHỈ PHỤC VỤ RESPONSIVE (MOBILE) =====
const MIN_POINT_WIDTH = 64
const isMobile = ref(false)

function updateBreakpoint() {
  isMobile.value = window.innerWidth < 768
}

function toggleLine(key: string) {
  hiddenLines.value.has(key)
    ? hiddenLines.value.delete(key)
    : hiddenLines.value.add(key)
  drawChart()
}

// ===== WATCH =====
watch(
  () => props.data,
  async () => {
    await nextTick()
    drawChart()
  },
  { deep: true, immediate: true }
)

watch(hiddenLines, () => nextTick(drawChart), { deep: true })

// ===== RESIZE =====
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

// ===== HELPERS (GIỮ NGUYÊN) =====
const formatDomain = (d: any) => d.label

const formatTooltipContent = (legend: any, d: any) => {
  const val = d.value ? d.value : t('chart.noData')
  const givingLocal = d?.givingLocalCurrency || t('chart.noData')
  return `
    <div style="line-height: 1.5">
      <div class="mb-1"><b>${legend.label}</b></div>
      ${t('chart.weekEnding')}: <b>${d.xLabel}</b><br>
      ${t('chart.giving')}: <b>${formatNumber(givingLocal) || 'N/A'}</b><br />
      ${t('chart.givingUsd')}: <b>${formatNumber(val) || 'N/A'}</b><br />
    </div>
  `
}

// ===== DRAW CHART (LOGIC GỐC, CHỈ CHÈN WIDTH MOBILE) =====
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

  const wrapperWidth = container.parentElement!.clientWidth

  const contentWidth = isMobile.value
    ? Math.max(data.length * MIN_POINT_WIDTH, wrapperWidth)
    : wrapperWidth

  const width = contentWidth - margin.left - margin.right
  const height = container.clientHeight - margin.top - margin.bottom

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', contentWidth)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3
    .scalePoint()
    .domain(normalizedData.map(d => d.xKey))
    .range([0, width])
    .padding(0.5)

  const maxY = d3.max(data, (d) => d3.max(legends.map((l) => d[l.key] || 0)))
  const y = d3.scaleLinear().domain([0, maxY!]).nice().range([height, 0])

  const xTickValues = x.domain().filter((_, i) => i % 4 === 0)

  svg
    .append('g')
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(''))
    .selectAll('line')
    .attr('stroke', '#ddd')
    .attr('stroke-opacity', 0.5)

  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(-height).tickFormat('').tickValues(xTickValues))
    .selectAll('line')
    .attr('stroke', '#eee')
    .attr('stroke-opacity', 0.5)

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
    .line<any>()
    .defined((d) => d.value != null && d.value !== 0)
    .x((d) => x(d.key)!)
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX)

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
      givingLocalCurrency:
          legend.key === 'givingUsd' ? d.givingLocalCurrency : d.mfpLocalCurrency,
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
      .attr('cx', (d) => x(d.key)!)
      .attr('cy', (d, i, arr: any[]) => {
        if (d.value != null && d.value !== 0) return y(d.value)

        let prev: number | null = null
        for (let j = i - 1; j >= 0; j--) {
          const v = arr[j]?.value
          if (v != null && v !== 0) {
            prev = v
            break
          }
        }

        let next: number | null = null
        for (let j = i + 1; j < arr.length; j++) {
          const v = arr[j]?.value
          if (v != null && v !== 0) {
            next = v
            break
          }
        }

        const refValue = prev != null && next != null ? (prev + next) / 2 : prev ?? next ?? 0
        return y(refValue)
      })
      .attr('r', (d) => (d.value == null || d.value === 0 ? 2.5 : 2.5))
      .attr('fill', legend.color)
      .style('opacity', (d) => (d.value == null || d.value === 0 ? 0.3 : 1))
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(formatTooltipContent(legend, d))
          .style('left', `${event.clientX + 10}px`)
          .style('top', `${event.clientY - 28}px`)
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
          ></div>
          <span
            class="text-caption"
            :style="{ opacity: hiddenLines.has(legend.key) ? 0.3 : 1 }"
          >
            {{ legend.label }}
          </span>
        </div>
      </div>

      <div v-if="!props.data?.length" class="text-center pa-8 text-grey">
        ...
      </div>

      <div v-else class="chart-scroll-wrapper">
        <div ref="chartContainer" class="chart-inner"></div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

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