<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h4">{{ title }}</span>
    </v-card-title>

    <v-card-text>
      <div ref="chartRef" class="w-100" style="height: 360px; position: relative;"></div>
      <div ref="tooltipRef" class="chart-tooltip" style="opacity: 0"></div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import { ref, watch, nextTick, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

// Props
const props = withDefaults(
  defineProps<{
    data: any[]
    title?: string
  }>(),
  { title: 'Visit Graph' }
)

// Theme colors
const barColor = theme.current.value.colors.chartVisit || '#B5282E'
const gridColor = '#aaaaaa'

// Refs
const chartRef = ref(null)
const tooltipRef = ref(null)
let svg = null

const drawChart = () => {
  const data = props.data || []
  const container = chartRef.value
  const tooltip = d3.select(tooltipRef.value)
  if (!container || data.length === 0) return

  const width = container.clientWidth
  const height = 360
  const margin = { top: 20, right: 20, bottom: 100, left: 60 } // margin-bottom cao hơn để không che

  // Clear old chart
  d3.select(container).selectAll('*').remove()

  // SVG
  svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // X scale — label từ data
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

  // Grid
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
      d3.select(this).attr('fill', d3.color(barColor).darker(0.8))
      tooltip
        .style('opacity', 1)
        .html(`<strong>${d.label}</strong><br/>Visits: ${d.visits}`)
        .style('left', event.offsetX + 15 + 'px')
        .style('top', event.offsetY - 20 + 'px')
    })
    .on('mousemove', function (event) {
      tooltip
        .style('left', event.offsetX + 15 + 'px')
        .style('top', event.offsetY - 20 + 'px')
    })
    .on('mouseout', function () {
      d3.select(this).attr('fill', barColor)
      tooltip.style('opacity', 0)
    })

  // --- Trục X với tick group 5 tuần + rotate
  const groupSize = 5 // group 5 tuần
  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(
      d3.axisBottom(x)
        .tickFormat((d, i) => (i % groupSize === 0 ? d : ''))
    )
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
    .style('font-size', '10px') // nhỏ hơn để không che
    .style('dominant-baseline', 'middle') // căn giữa chữ dọc
  

  // Axis Y
  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5))
}

onMounted(() => nextTick(drawChart))

watch(
  () => props.data,
  async () => {
    await nextTick()
    drawChart()
  },
  { deep: true }
)
</script>

<style scoped>
.grid path {
  stroke-width: 0;
}
.chart-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  pointer-events: none;
  font-size: 13px;
  transition: opacity 0.1s;
}
</style>
