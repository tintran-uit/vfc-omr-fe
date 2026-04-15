<script setup lang="ts">
import * as d3 from 'd3'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { formatDate, getISOWeekRange } from '@/helpers/dateTimeHelper'

/* ================== SETUP ================== */
const theme = useTheme()
const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    data: any[]
    title?: string
  }>(),
  { title: 'Visit Graph' }
)

const barColor = theme.current.value.colors.chartVisit || '#B5282E'
const gridColor = '#aaaaaa'

const chartRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null

/* ================== MOBILE SCROLL CONFIG ================== */
const MIN_BAR_WIDTH = 48 // px / bar
const isMobile = ref(false)

function updateBreakpoint() {
  isMobile.value = window.innerWidth < 768
}

/* ================== TOOLTIP ================== */
const formatTooltipContent = (d: any) => {
  const visitUserText = d.visitedUser?.join('<br />') ?? ''
  return `
    <div style="line-height: 1.5">
      <div class="mb-1"><b>${t('chart.visits')}</b></div>
      ${t('chart.weekEnding')}: <strong>${d.xLabel}</strong><br>
      ${visitUserText}
    </div>
  `
}
/*
 <strong>W${d.week}.${d.year}</strong><br/>
    (${d.label})<br />
    <b></b>: ${d.visits}
    */

/* ================== DRAW CHART ================== */
const drawChart = () => {
  const data = props.data || []
  const container = chartRef.value
  if (!container || data.length === 0) return

  const normalizedData = data.map(d => {
    const [startDate, endDate] = getISOWeekRange(d.year, d.week)

    return {
      ...d,
      visits: Number(d.visits) || 0,
      xKey: `${d.year}-W${d.week}`,
      xLabel: formatDate(endDate, 'DD MMM ’YY'),
      startDate: startDate,
      endDate: endDate,
    }
  })

  const tooltip = d3.select(tooltipRef.value!)

  const wrapperWidth = container.parentElement!.clientWidth
  const contentWidth = isMobile.value
    ? Math.max(data.length * MIN_BAR_WIDTH, wrapperWidth)
    : wrapperWidth

  const height = 360
  const margin = { top: 20, right: 20, bottom: 100, left: 60 }
  const width = contentWidth

  d3.select(container).selectAll('svg').remove()

  svg = d3
    .select(container)
    .append('svg')
    .attr('width', contentWidth)
    .attr('height', height)

  /* ===== X SCALE ===== */
  const x = d3
    .scaleBand()
    .domain(normalizedData.map(d => d.xKey))
    .range([margin.left, width - margin.right])
    .padding(0.2)

  /* ===== Y SCALE ===== */
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => Number(d.visits)) || 10])
    .nice()
    .range([height - margin.bottom, margin.top])

  /* ===== GRID Y ===== */
  const yAxisGrid = d3
    .axisLeft(y)
    .ticks(5)
    .tickSize(-width + margin.left + margin.right)
    .tickFormat(() => '')

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxisGrid)
    .selectAll('line')
    .attr('stroke', gridColor)
    .attr('stroke-opacity', 0.3)

  /* ===== BARS ===== */
  svg
    .selectAll('rect')
    .data(normalizedData)
    .join('rect')
    .attr('x', (d) => x(d.xKey)!)
    .attr('y', (d) => y(d.visits || 0))
    .attr('width', x.bandwidth())
    .attr('height', (d) => y(0) - y(d.visits || 0))
    .attr('fill', barColor)
    .style('cursor', 'pointer')
    .on('mouseover', function (event, d) {
  d3.select(this)
    .attr('fill', d3.color(barColor)!.darker(0.8).toString())

  tooltip
    .style('opacity', 1)
    .html(formatTooltipContent(d))
})
.on('mousemove', function (event) {
  const containerEl = chartRef.value!
  const tooltipEl = tooltipRef.value!

  const [mouseX, mouseY] = d3.pointer(event, containerEl)

  const tooltipWidth = tooltipEl.offsetWidth
  const tooltipHeight = tooltipEl.offsetHeight
  const containerWidth = containerEl.clientWidth

  const OFFSET = 12

  // 👉 Mặc định hiển thị bên phải
  let left = mouseX + OFFSET

  // 👉 Nếu sát mép phải → lật sang trái
  if (left + tooltipWidth > containerWidth) {
    left = mouseX - tooltipWidth - OFFSET
  }

  // 👉 Tránh bị che trên đầu
  let top = mouseY - tooltipHeight / 2
  if (top < 0) top = 0

  tooltip
    .style('left', `${left}px`)
    .style('top', `${top}px`)
})
.on('mouseout', function () {
  d3.select(this).attr('fill', barColor)
  tooltip.style('opacity', 0)
})

  /* ===== X AXIS ===== */
  const tickEvery = 5

  const xAxis = d3
    .axisBottom(x)
    .tickFormat((key, i) => {
      if (i % tickEvery !== 0) return ''

      const item = normalizedData.find(d => d.xKey === key)
      return item ? item.xLabel : ''
    })
    .tickSize(0)
    .tickPadding(10)

  const xAxisGroup = svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis)

  xAxisGroup
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
    .style('font-size', '10px')

  normalizedData.forEach((d, i) => {
    if (i % tickEvery === 0) {
      const xPos = x(d.xKey)
      if (xPos !== undefined) {
        xAxisGroup
          .append('line')
          .attr('x1', xPos + x.bandwidth() / 2)
          .attr('y1', 0)
          .attr('x2', xPos + x.bandwidth() / 2)
          .attr('y2', 6)
          .attr('stroke', '#000')
      }
    }
  })

  /* ===== Y AXIS ===== */
  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5))
}

/* ================== LIFECYCLE ================== */
onMounted(() => {
  updateBreakpoint()
  window.addEventListener('resize', updateBreakpoint)
  nextTick(drawChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateBreakpoint)
})

watch(
  () => props.data,
  async () => {
    await nextTick()
    drawChart()
  },
  { deep: true }
)
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h5">{{ title }}</span>
    </v-card-title>

    <v-card-text>
      <!-- SCROLL WRAPPER -->
      <div class="chart-scroll-wrapper">
        <div
          ref="chartRef"
          class="chart-inner"
          style="height: 360px; position: relative;"
        >
          <div ref="tooltipRef" class="chart-tooltip" style="opacity: 0"></div>
        </div>
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
  min-width: 100%;
}

.grid path {
  stroke-width: 0;
}

.chart-tooltip {
  position: absolute;
  background: rgba(0,0,0,0.8);
  color: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  pointer-events: none;
  font-size: 12px;
  line-height: 1.4;
  transition: opacity 0.1s;
  z-index: 10;

  min-width: 180px;
  white-space: nowrap;
}
</style>
