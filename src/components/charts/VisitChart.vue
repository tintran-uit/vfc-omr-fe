<script setup lang="ts">
import * as d3 from "d3";
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";

/* ================== SETUP ================== */
const theme = useTheme();
const { t, locale } = useI18n();

const props = withDefaults(
  defineProps<{
    data: any[];
    title?: string;
  }>(),
  { title: "Churches Planted Annually Over the Last 12 Years" },
);

const barColor = theme.current.value.colors.chartVisit || "#B5282E";
const gridColor = "#aaaaaa";

const chartRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLElement | null>(null);
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;

/* ================== MOBILE ================== */
const MIN_BAR_WIDTH = 48;
const isMobile = ref(false);

function updateBreakpoint() {
  isMobile.value = window.innerWidth < 768;
}

/* ================== TOOLTIP ================== */
const formatTooltipContent = (d: any) => {
  return `
    <div style="line-height: 1.5">
      <div class="mb-1"><b>${t("chart.count")}</b></div>
      ${t("year")}: <strong>${d.year}</strong><br>
      ${t("chart.count")}: <b>${d.count}</b>
    </div>
  `;
};

/* ================== DRAW ================== */
const drawChart = () => {
  const data = props.data || [];
  const container = chartRef.value;
  if (!container || data.length === 0) return;

  /* ===== ✅ NORMALIZE DATA (FIX CHUẨN) ===== */
  const normalizedData = data.map((d) => ({
    year: d.year,
    count: Number(d.count) || 0,
    xKey: String(d.year),
    xLabel: String(d.year),
  }));

  const tooltip = d3.select(tooltipRef.value!);

  const wrapperWidth = container.parentElement?.clientWidth || 600;
  const contentWidth = isMobile.value
    ? Math.max(data.length * MIN_BAR_WIDTH, wrapperWidth)
    : wrapperWidth;

  const height = 360;
  const margin = { top: 20, right: 20, bottom: 80, left: 60 };
  const width = contentWidth;

  d3.select(container).selectAll("svg").remove();

  svg = d3.select(container).append("svg").attr("width", contentWidth).attr("height", height);

  /* ===== SCALE ===== */
  const x = d3
    .scaleBand()
    .domain(normalizedData.map((d) => d.xKey))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(normalizedData, (d) => d.count) || 10])
    .nice()
    .range([height - margin.bottom, margin.top]);

  /* ===== GRID ===== */
  const yAxisGrid = d3
    .axisLeft(y)
    .ticks(5)
    .tickSize(-width + margin.left + margin.right)
    .tickFormat(() => "");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxisGrid)
    .selectAll("line")
    .attr("stroke", gridColor)
    .attr("stroke-opacity", 0.3);

  /* ===== BARS ===== */
  svg
    .selectAll("rect")
    .data(normalizedData)
    .join("rect")
    .attr("x", (d) => x(d.xKey)!)
    .attr("y", (d) => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(0) - y(d.count))
    .attr("fill", barColor)
    .style("cursor", "pointer")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", d3.color(barColor)!.darker(0.8).toString());
      tooltip.style("opacity", 1).html(formatTooltipContent(d));
    })
    .on("mousemove", function (event) {
      const containerEl = chartRef.value!;
      const tooltipEl = tooltipRef.value!;

      const [mouseX, mouseY] = d3.pointer(event, containerEl);

      const tooltipWidth = tooltipEl.offsetWidth;
      const tooltipHeight = tooltipEl.offsetHeight;
      const containerWidth = containerEl.clientWidth;

      const OFFSET = 12;

      let left = mouseX + OFFSET;
      if (left + tooltipWidth > containerWidth) {
        left = mouseX - tooltipWidth - OFFSET;
      }

      let top = mouseY - tooltipHeight / 2;
      if (top < 0) top = 0;

      tooltip.style("left", `${left}px`).style("top", `${top}px`);
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", barColor);
      tooltip.style("opacity", 0);
    });

  /* ===== X AXIS (KHÔNG rotate) ===== */
  const xAxis = d3
    .axisBottom(x)
    .tickFormat((key) => {
      const item = normalizedData.find((d) => d.xKey === key);
      return item ? item.xLabel : "";
    })
    .tickSize(0)
    .tickPadding(10);

  const xAxisGroup = svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  xAxisGroup.selectAll("text").style("text-anchor", "middle").style("font-size", "12px");

  /* ===== X LABEL ===== */
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom + 50)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#2B6893")
    .text(t("chart.years"));

  /* ===== Y AXIS ===== */
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5));
};

/* ================== LIFE ================== */
onMounted(() => {
  updateBreakpoint();
  window.addEventListener("resize", updateBreakpoint);
  nextTick(drawChart);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateBreakpoint);
});

watch(
  () => props.data,
  async () => {
    await nextTick();
    drawChart();
  },
  { deep: true },
);

// Axis/tooltip text is drawn imperatively via D3, so redraw when the language changes.
watch(locale, () => nextTick(drawChart));
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h5">{{ title }}</span>
    </v-card-title>

    <v-card-text>
      <div class="chart-scroll-wrapper">
        <div
          ref="chartRef"
          style="height: 360px; position: relative"
        >
          <div
            ref="tooltipRef"
            class="chart-tooltip"
            style="opacity: 0; position: absolute"
          ></div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
