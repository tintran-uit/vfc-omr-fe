<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h4">{{ title }}</span>
    </v-card-title>

    <v-card-text>
      <div
        ref="chartRef"
        class="w-100"
        style="height: 360px; position: relative;"
      >
        <div ref="tooltipRef" class="chart-tooltip" style="opacity: 0"></div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import { ref, watch, nextTick, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

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

const chartRef = ref(null)
const tooltipRef = ref(null)
let svg = null
const formatTooltipContent = (d) => {
  return `
    <strong>W${d.week}.${d.year}</strong><br/>
    (${d.label})<br />
    <b>${t('chart.visits')}</b>: ${d.visits}
  `
}

const drawChart = () => {
  const data = props.data || []
  const container = chartRef.value
  const tooltip = d3.select(tooltipRef.value)

  if (!container || data.length === 0) return

  const width = container.clientWidth
  const height = 360
  const margin = { top: 20, right: 20, bottom: 100, left: 60 }

  d3.select(container).selectAll('*:not(.chart-tooltip)').remove()

  svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // X scale
  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([margin.left, width - margin.right])
    .padding(0.2)

  // Y scale
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => Number(d.visits)) || 10])
    .nice()
    .range([height - margin.bottom, margin.top])

  // Grid Y
  const yAxisGrid = d3
    .axisLeft(y)
    .ticks(5)
    .tickSize(-width + margin.left + margin.right)
    .tickFormat(() => '')

  svg
    .append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxisGrid)
    .selectAll('line')
    .attr('stroke', gridColor)
    .attr('stroke-opacity', 0.3)

  // Bars
  svg
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(d.label))
    .attr('y', (d) => y(Number(d.visits) || 0))
    .attr('width', x.bandwidth())
    .attr('height', (d) => y(0) - y(Number(d.visits) || 0))
    .attr('fill', barColor)
    .on('mouseover', function (event, d) {
      const [mouseX, mouseY] = d3.pointer(event, container)
      d3.select(this).attr('fill', d3.color(barColor).darker(0.8))
      console.log(d)
      tooltip
        .style('opacity', 1)
        .html(formatTooltipContent(d))
        .style('left', `${mouseX + 15}px`)
        .style('top', `${mouseY - 20}px`)
    })
    .on('mousemove', function (event) {
      const [mouseX, mouseY] = d3.pointer(event, container)
      tooltip
        .style('left', `${mouseX + 15}px`)
        .style('top', `${mouseY - 20}px`)
    })
    .on('mouseout', function () {
      d3.select(this).attr('fill', barColor)
      tooltip.style('opacity', 0)
    })

  // X Axis: chỉ hiển thị label mỗi 5 tuần
  const tickEvery = 5

  const xAxis = d3.axisBottom(x)
    .tickFormat((d, i) => (i % tickEvery === 0 ? d : ''))
    .tickSize(0) // tạm ẩn tick gốc
    .tickPadding(10)

  const xAxisGroup = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis)

  // X tick lines thủ công cho index 0,5,10,15...
  xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
    .style('font-size', '10px')

  data.forEach((d, i) => {
    if (i % tickEvery === 0) {
      xAxisGroup.append('line')
        .attr('x1', x(d.label) + x.bandwidth() / 2)
        .attr('y1', 0)
        .attr('x2', x(d.label) + x.bandwidth() / 2)
        .attr('y2', 6) // độ dài tick
        .attr('stroke', '#000')
    }
  })

  // Y Axis
  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5))
}

onMounted(() => nextTick(drawChart))
watch(() => props.data, async () => { await nextTick(); drawChart() }, { deep: true })
</script>

<style scoped>
.grid path {
  stroke-width: 0;
}

.chart-tooltip {
  position: absolute;
  background: rgba(0,0,0,0.8);
  color: #fff;
  padding: 4px 8px; /* nhỏ hơn */
  border-radius: 4px;
  pointer-events: none;
  font-size: 12px; /* chữ nhỏ hơn */
  line-height: 1.4; /* giống attendance chart */
  transition: opacity 0.1s;
  z-index: 10;
}
</style>
