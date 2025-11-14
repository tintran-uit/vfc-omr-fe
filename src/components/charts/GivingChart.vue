<script setup lang="ts">
import * as d3 from 'd3'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from 'vuetify'
import { getWeekRange } from '@/helpers/dateTimeHelper'
import { useI18n } from 'vue-i18n';

const theme = useTheme()

// ✅ Props
const props = withDefaults(
  defineProps<{
    data: any[]
    title?: string
  }>(),
  { title: 'Giving graph' }
)

const { t } = useI18n();
// ✅ Legend cấu hình
const legends = [
  { key: 'givingUsd', label: t('chart.legendTithesAndOfferings'), color: theme.current.value.colors.chartGiving },
  { key: 'mfpUsd', label: t('chart.legendMissionsMFPGiving'), color: theme.current.value.colors.chartMfp },
]

const chartContainer = ref(null)
const hiddenLines = ref(new Set())

function toggleLine(key: string) {
  if (hiddenLines.value.has(key)) hiddenLines.value.delete(key)
  else hiddenLines.value.add(key)
  drawChart()
}

// Watch dữ liệu
watch(() => props.data, async () => {
  await nextTick()
  drawChart()
}, { deep: true, immediate: true })

watch(hiddenLines, () => nextTick(drawChart), { deep: true })

// Resize
onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
function handleResize() {
  nextTick(drawChart)
}

// ✅ Domain format giống AttendanceChart
const formatDomain = (d) => d.label

// ✅ Tooltip content giống AttendanceChart
const formatTooltipContent = (legend, d) => {
  const val = d.value ? d.value : t('chart.noData'); 
  const givingLocal = d?.givingLocalCurrency || t('chart.noData')
  return `
    <div style="line-height: 1.5">
    <b>${legend.label}</b><br>
    <b>${t('chart.week')}</b>: W${d.week}.${d.year} (${d.startDate} - ${d.endDate})<br>
    <b>${t('chart.givingUsd')}</b>: ${val}<br />
    <b>${t('chart.givingLocalCurrency')}</b>: ${givingLocal}
    </div>
  `;
}
// const formatTooltipContent = (legend, d) => {
//   return d.value != null
//     ? `<b>${legend.label}</b><br>Week: W${d.week}.${d.year} (${d.startDate} - ${d.endDate})<br>Amount: ${d.value}`
//     : `<b>${legend.label}</b><br>Week: W${d.week}.${d.year} (${d.startDate} - ${d.endDate})<br><i>No data</i>`
// }

// ✅ Draw chart
function drawChart() {
  const data = props.data
  const container = chartContainer.value
  if (!container || !data?.length) return

  d3.select(container).selectAll('*').remove()
  // d3.select('body').selectAll('.d3-tooltip').remove()

  const margin = { top: 20, right: 20, bottom: 60, left: 50 }
  const width = container.clientWidth - margin.left - margin.right
  const height = container.clientHeight - margin.top - margin.bottom

  const svg = d3.select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // X scale
  const x = d3.scalePoint()
    .domain(data.map(formatDomain))
    .range([0, width])
    .padding(0.5)

  // Y scale
  const maxY = d3.max(data, d => d3.max(legends.map(l => d[l.key] || 0)))
  const y = d3.scaleLinear().domain([0, maxY]).nice().range([height, 0])

  const xTickValues = x.domain().filter((_, i) => i % 4 === 0)

  // Grid lines
  svg.append('g').attr('class', 'grid grid-y')
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(''))
    .selectAll('line')
    .attr('stroke', '#ddd')
    .attr('stroke-opacity', 0.5)

  svg.append('g').attr('class', 'grid grid-x')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(-height).tickFormat('').tickValues(xTickValues))
    .selectAll('line')
    .attr('stroke', '#eee')
    .attr('stroke-opacity', 0.5)

  // Axes
  svg.append('g').attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(xTickValues))
    .selectAll('text')
    .attr('transform', 'rotate(-20)')
    .style('text-anchor', 'end')
    .style('font-size', '11px')

  svg.append('g').call(d3.axisLeft(y))

  // Tooltip
  let tooltip = d3.select('body').select('.d3-tooltip-global')
  if (tooltip.empty()) {
      tooltip = d3.select('body')
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

  // Line generator
  const line = d3.line()
    .defined((d) => d.value != null && d.value !== 0)
    .x(d => x(d.key))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX)

  // Draw lines & dots
  legends.forEach(legend => {
    if (hiddenLines.value.has(legend.key)) return

    const lineData = data.map(d => {
      const [start, end] = getWeekRange(d.year, d.week, 'DD MMM')
      
      return {
        key: formatDomain(d),
        week: d.week,
        year: d.year,
        startDate: start,
        endDate: end,
        value: d[legend.key],
        givingLocalCurrency: legend.key === 'givingUsd' ? d.givingLocalCurrency : d.mfpLocalCurrency
      }
    })

    // Path line
    svg.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', legend.color)
      .attr('stroke-width', 2)
      .attr('d', line)

    // Dots
    svg.selectAll(`.dot-${legend.key}`)
      .data(lineData)
      .enter()
      .append('circle')
      .attr('class', `dot-${legend.key}`)
      .attr('cx', d => x(d.key))
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
      .attr('r', (d) => (d.value == null || d.value === 0 ? 3 : 4))
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

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h4">{{ title }}</span>
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