<script setup>
import * as d3 from 'd3'
import { ref, watch, nextTick, onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

// ✅ Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
    // ví dụ: [{ week: 1, visits: 4 }, { week: 2, visits: 7 }]
  },
})

// ✅ Màu cấu hình theo theme
const barColor = theme.current.value.colors.chartVisit || '#B5282E'
const gridColor = '#aaaaaa' // <- thêm màu grid

// ✅ Ref
const chartRef = ref(null)
const tooltipRef = ref(null)
let svg = null

const drawChart = () => {
  const data = props.data || []
  const container = chartRef.value
  const tooltip = d3.select(tooltipRef.value)
  if (!container) return

  const width = container.clientWidth
  const height = 360
  const margin = { top: 20, right: 20, bottom: 40, left: 60 }

  // Xoá chart cũ
  d3.select(container).selectAll('*').remove()

  // SVG
  svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Thang đo
  const x = d3
    .scaleLinear()
    .domain([1, d3.max(data, (d) => d.week) || 52])
    .range([margin.left, width - margin.right])

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.visits) || 10])
    .nice()
    .range([height - margin.bottom, margin.top])

  // ✅ Grid ngang (mờ, lấy từ theme)
  const yAxisGrid = d3
    .axisLeft(y)
    .ticks(5)
    .tickSize(-width + margin.left + margin.right)
    .tickFormat('')

  svg
    .append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxisGrid)
    .selectAll('line')
    .attr('stroke', gridColor)
    .attr('stroke-opacity', 0.3)

  // ✅ Vẽ cột
  svg
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(d.week) - 5)
    .attr('y', (d) => y(d.visits))
    .attr('width', 10)
    .attr('height', (d) => y(0) - y(d.visits))
    .attr('fill', barColor)
    .on('mouseover', function (event, d) {
      d3.select(this).attr('fill', d3.color(barColor).darker(0.8))
      tooltip
        .style('opacity', 1)
        .html(`<strong>Week ${d.week}</strong><br/>Visits: ${d.visits}`)
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

  // ✅ Trục X
  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format('d')))

  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', height - 5)
    .attr('fill', '#1e4a7b')
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')

  // ✅ Trục Y
  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5))

  svg
    .append('text')
    .attr('x', -height / 2)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .attr('fill', '#1e4a7b')
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
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

<template>
  <v-card class="pa-4">

    <v-card-text>
      <div ref="chartRef" class="w-100" style="height: 360px; position: relative;"></div>
      <div ref="tooltipRef" class="chart-tooltip" style="opacity: 0"></div>
    </v-card-text>
  </v-card>
</template>

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
