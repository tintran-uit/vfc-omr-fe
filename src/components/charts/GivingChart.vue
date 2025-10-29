<script setup lang="ts">
import * as d3 from 'd3'
import { ref, watch, nextTick } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

// ✅ Props
const props = withDefaults(
  defineProps<{
    data: any[]
    title?: string
  }>(),
  {
    title: 'Giving graph'
  }
)

// ✅ Legend cấu hình
const legends = [
  { key: 'givingUsd', label: 'Tithes & Offerings', color: theme.current.value.colors.chartGiving },
  { key: 'mfpUsd', label: 'Missions MFP Giving', color: theme.current.value.colors.chartMfp },
]

const chartContainer = ref(null)
const hiddenLines = ref(new Set())

function toggleLine(key) {
  if (hiddenLines.value.has(key)) hiddenLines.value.delete(key)
  else hiddenLines.value.add(key)
  drawChart()
}

watch(
  () => props.data,
  () => nextTick(drawChart),
  { deep: true, immediate: true }
)

watch(hiddenLines, () => nextTick(drawChart), { deep: true })

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

  // X scale
  const x = d3
    .scalePoint()
    .domain(data.map((d) => d.week))
    .range([0, width])
    .padding(0.5)

  // Y scale
  const maxY = d3.max(data, (d) =>
    d3.max(legends.map((l) => d[l.key] || 0))
  )
  const y = d3.scaleLinear().domain([0, maxY]).nice().range([height, 0])

  // Giảm tick cho trục X
  const xAxis = d3
    .axisBottom(x)
    .tickValues(x.domain().filter((_, i) => i % 4 === 0)) // chỉ hiển thị mỗi 4 tuần 1 tick

  // Axes
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('text')
    .attr('transform', 'rotate(-20)')
    .style('text-anchor', 'end')
    .style('font-size', '11px')

  svg.append('g').call(d3.axisLeft(y))

  // Tooltip
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

  // Line generator
  // const line = d3
  //   .line()
  //   .defined(d => d.value != null) // 👈 chỉ vẽ khi có giá trị thật
  //   .x((d) => x(d.week))
  //   .y((d) => y(d.value))
  //   .curve(d3.curveMonotoneX)

  const line = d3
  .line()
  .defined((d) => d.value != null)
  .x((d) => x(d.week))
  .y((d) => y(d.value))
  .curve(d3.curveMonotoneX)

// Draw lines
legends.forEach((legend) => {
  if (hiddenLines.value.has(legend.key)) return

  const lineData = data.map((d) => ({
    week: d.week,
    value: d[legend.key],
  }))

  // Path line
  svg
    .append('path')
    .datum(lineData)
    .attr('fill', 'none')
    .attr('stroke', legend.color)
    .attr('stroke-width', 2)
    .attr('d', line)

  // ✅ Dots (hiển thị cả null)
  svg
    .selectAll(`.dot-${legend.key}`)
    .data(lineData)
    .enter()
    .append('circle')
    .attr('class', `dot-${legend.key}`)
    .attr('cx', (d) => x(d.week))
    .attr('cy', (d, i, arr) => {
      if (d.value != null) return y(d.value)

      // Nếu null → lấy y của điểm trước hoặc sau gần nhất
      const prev = arr[i - 1] ? arr[i - 1].__data__?.value : null
      const next = arr[i + 1] ? arr[i + 1].__data__?.value : null
      const refValue = prev ?? next ?? 0
      return y(refValue)
    })
    .attr('r', (d) => (d.value == null ? 3 : 4))
    .attr('fill', legend.color)
    .style('opacity', (d) => (d.value == null ? 0.3 : 1)) // 👈 mờ khi null
    .style('cursor', 'pointer')
    .on('mouseenter', function (event, d) {
      tooltip
        .style('opacity', 1)
        .html(
          d.value != null
            ? `<b>${legend.label}</b><br>${d.week}<br>Attendance: ${d.value}`
            : `<b>${legend.label}</b><br>${d.week}<br><i>No data</i>`
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
/* Tooltip style tách riêng để không bị scoped */
.d3-tooltip {
  font-family: Roboto, sans-serif;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
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