<script setup>
import * as d3 from "d3";
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";

const theme = useTheme();
const { t } = useI18n();

/* ================== PROPS ================== */
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "Attendance",
  },
});

/* ================== LEGENDS (FIX CỨNG – KHÔNG DÙNG year) ================== */
const legends = [
  { key: "currentYear", label: "Current Year", color: theme.current.value.colors.chartCurrentYear },
  { key: "lastYear", label: "Last Year", color: theme.current.value.colors.chartLastYear },
  {
    key: "yearBeforeLast",
    label: "Year Before Last",
    color: theme.current.value.colors.chartYearBeforeLast,
  },
];

/* ================== STATE ================== */
const chartContainer = ref(null);
const hiddenLines = ref(new Set());
const isMobile = ref(false);
const MIN_POINT_WIDTH = 64;

function updateBreakpoint() {
  isMobile.value = window.innerWidth < 768;
}

/* ================== TOOLTIP ================== */
const formatTooltipContent = (legend, d) => {
  const val = d.value != null ? d.value : "No data";
  return `
    <div style="line-height: 1.5">
      <div class="mb-1"><b>${legend.label}</b></div>
      Week: <b>${d.xLabel}</b><br>
      Attendance: <b>${val}</b>
    </div>
  `;
};

function toggleLine(key) {
  hiddenLines.value.has(key) ? hiddenLines.value.delete(key) : hiddenLines.value.add(key);

  drawChart();
}

/* ================== WATCH ================== */
watch(
  () => props.data,
  async () => {
    await nextTick();
    drawChart();
  },
  { deep: true, immediate: true },
);

watch(hiddenLines, () => nextTick(drawChart), { deep: true });

/* ================== RESIZE ================== */
onMounted(() => {
  updateBreakpoint();
  window.addEventListener("resize", updateBreakpoint);
  window.addEventListener("resize", drawChart);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBreakpoint);
  window.removeEventListener("resize", drawChart);
});

/* ================== DRAW ================== */
function drawChart() {
  const data = props.data;
  const container = chartContainer.value;
  if (!container || !data?.length) return;

  const normalizedData = data
    .sort((a, b) => a.week - b.week)
    .map((d) => ({
      ...d,
      xKey: `W${d.week}`,
      xLabel: `${d.week}`,
    }));

  d3.select(container).selectAll("*").remove();

  const margin = { top: 20, right: 20, bottom: 60, left: 50 };
  const height = 400 - margin.top - margin.bottom;

  const wrapperWidth = container.parentElement.clientWidth;
  const contentWidth = isMobile.value
    ? Math.max(normalizedData.length * MIN_POINT_WIDTH, wrapperWidth)
    : wrapperWidth;

  const width = contentWidth - margin.left - margin.right;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", contentWidth)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  /* ===== SCALE ===== */
  const x = d3
    .scalePoint()
    .domain(normalizedData.map((d) => d.xKey))
    .range([0, width])
    .padding(0.5);

  const maxY = d3.max(normalizedData, (d) => d3.max(legends.map((l) => d[l.key] ?? 0))) || 1;

  const y = d3.scaleLinear().domain([0, maxY]).nice().range([height, 0]);

  const xTickValues = x.domain().filter((_, i) => i % 4 === 0);

  /* ===== GRID ===== */
  svg
    .append("g")
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
    .selectAll("line")
    .attr("stroke", "#ddd")
    .attr("stroke-opacity", 0.5);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(-height).tickFormat("").tickValues(xTickValues))
    .selectAll("line")
    .attr("stroke", "#eee")
    .attr("stroke-opacity", 0.5);

  /* ===== AXIS ===== */
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(xTickValues)
        .tickFormat((key) => {
          const found = normalizedData.find((d) => d.xKey === key);
          return found ? found.xLabel : "";
        }),
    )
    .selectAll("text")
    .attr("transform", null)
    .style("text-anchor", "end")
    .style("font-size", "11px");

  svg.append("g").call(d3.axisLeft(y));

  /* ===== X AXIS LABEL ===== */
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#666")
    .text("Weeks for year");

  /* ===== TOOLTIP ===== */
  let tooltip = d3.select("body").select(".d3-tooltip-global");
  if (tooltip.empty()) {
    tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip-global")
      .style("position", "fixed")
      .style("z-index", 999999)
      .style("pointer-events", "none")
      .style("background", "rgba(0,0,0,0.75)")
      .style("color", "#fff")
      .style("padding", "6px 8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("opacity", 0);
  }

  const line = d3
    .line()
    .defined((d) => d.value != null)
    .x((d) => x(d.key))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX);

  /* ===== DRAW ===== */
  legends.forEach((legend) => {
    if (hiddenLines.value.has(legend.key)) return;

    const lineData = normalizedData.map((d) => ({
      key: d.xKey,
      xLabel: d.xLabel,
      value: d[legend.key],
    }));

    const hasData = lineData.some((d) => d.value != null);
    if (!hasData) return;

    svg
      .append("path")
      .datum(lineData)
      .attr("fill", "none")
      .attr("stroke", legend.color)
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .selectAll(`.dot-${legend.key}`)
      .data(lineData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.key))
      .attr("cy", (d) => (d.value != null ? y(d.value) : y(0)))
      .attr("r", 2.5)
      .attr("fill", legend.color)
      .style("opacity", (d) => (d.value != null ? 1 : 0))
      .style("cursor", "pointer")
      .on("mouseenter", (e, d) => {
        tooltip.style("opacity", 1).html(formatTooltipContent(legend, d));
      })
      .on("mousemove", (e) => {
        tooltip.style("left", `${e.clientX + 10}px`).style("top", `${e.clientY - 28}px`);
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));
  });
}
</script>

<template>
  <div class="pa-4">
    <div class="d-flex flex-wrap justify-end mb-2">
      <div
        v-for="legend in legends"
        :key="legend.key"
        class="mr-3 cursor-pointer d-flex align-center"
        @click="toggleLine(legend.key)"
      >
        <div
          :style="{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: legend.color,
            opacity: hiddenLines.has(legend.key) ? 0.3 : 1,
          }"
          class="mr-1"
        />
        <span :style="{ opacity: hiddenLines.has(legend.key) ? 0.3 : 1 }">
          {{ legend.label }}
        </span>
      </div>
    </div>

    <div class="chart-scroll-wrapper">
      <div
        ref="chartContainer"
        class="chart-inner"
      ></div>
    </div>
  </div>
</template>

<style scoped></style>
