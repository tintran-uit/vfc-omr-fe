<script setup lang="ts">
import { onMounted, watch, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import { reportService } from "@/services/reportService";
import { churchService } from "@/services/churchService";
import { getWeekRange } from "@/helpers/dateTimeHelper";
import { graphService } from '@/services/graphService';
import { formatNumber, formatCurrency } from "@/helpers/appHelper";
import { getISOWeekRange, formatDate } from "@/helpers/dateTimeHelper";

const { t } = useI18n();
const selectedChurchId = ref(null);
const selectedChurch = ref({})
const selectedChurchReport4Weeks = ref([]);
const data4Weeks = ref([]);

const props = withDefaults(
  defineProps<{
    churchId: number
  }>(),
  {}
)
const data = ref(null);
// ✅ Tooltip helper
function createTooltip(containerId: string) {
  const oldTooltip = document.getElementById("jit-tooltip");
  if (oldTooltip) oldTooltip.remove();

  const tooltip = document.createElement("div");
  tooltip.id = "jit-tooltip";
  Object.assign(tooltip.style, {
    position: "absolute",
    padding: "6px 10px",
    background: "rgba(0,0,0,0.8)",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "12px",
    pointerEvents: "none",
    opacity: 0,
    transition: "opacity 0.2s",
    zIndex: 1000,
    maxWidth: "220px",
  });

  const container = document.getElementById(containerId);
  if (container) container.appendChild(tooltip);

  return {
    show(content: string, event: MouseEvent) {
      if (!container) return;
      tooltip.innerHTML = content;

      const rect = container.getBoundingClientRect?.();
      if (!rect) return;

      tooltip.style.left = event.clientX - rect.left + 15 + "px";
      tooltip.style.top = event.clientY - rect.top + 15 + "px";
      tooltip.style.opacity = "1";
    },
    hide() {
      tooltip.style.opacity = "0";
    },
  };
}

// ✅ API giả lập
// async function fetchChurchDetail(churchId: string) {

//   const result = await reportService.getLast4WeeksOfChurch(churchId)

//   console.log("📡 Fetching detail for:", nodeId);
//   await new Promise((r) => setTimeout(r, 500));
// }

// ✅ Hàm vẽ chart
function renderGraph(json: any) {
  const containerId = "infovis";
  const container = document.getElementById(containerId);

  if (!container) {
    console.warn("⚠️ Container chưa sẵn sàng, thử lại sau 100ms");
    setTimeout(() => renderGraph(json), 100);
    return;
  }

  // 🧹 Dọn biểu đồ cũ
  container.innerHTML = "";

  const tooltip = createTooltip(containerId);

  const rgraph = new $jit.RGraph({
    injectInto: containerId,
    background: { CanvasStyles: { strokeStyle: "#d5d5d5", lineWidth: 0.6 } },
    Navigation: { enable: true, panning: true, zooming: 10 },
    Node: { overridable: true },
    Edge: { color: "#c8c8c8", lineWidth: 0.6 },

    onCreateLabel(domElement, node) {
      domElement.innerHTML = node.name;
      domElement.style.cursor = "pointer";

      domElement.onclick = async () => {
        rgraph.onClick(node.id, {
          hideLabels: false,
          onComplete: () => layoutLabels(),
        });

        selectedChurchId.value = node.id
      };

      let tooltipContent = "";
      domElement.onmouseover = (event: MouseEvent) => {
        const data = node.data || {};
        tooltipContent = `
          <b>${data.full_name}</b><br/>
          ${t("chart.averageAttendance")}: <b>${data.avg_attendance ?? "N/A"}</b><br/>
        `;
        tooltip.show(tooltipContent, event);
      };
      domElement.onmousemove = (event: MouseEvent) => tooltip.show(tooltipContent, event);
      domElement.onmouseout = () => tooltip.hide();
    },

    onPlaceLabel(domElement, node) {
      if (!domElement || !domElement.style) return;

      const scale = canvasScale();
      const fontPx = Math.max(7, Math.min(11, Math.round(11 * scale)));
      const style = domElement.style;
      style.fontSize = fontPx + "px";
      style.fontWeight = "600";
      style.color = "#1a1a1a";
      style.lineHeight = "1.1";
      style.whiteSpace = "nowrap";
      style.display = "block";
      style.width = "max-content";
      style.maxWidth = "none";
      style.padding = "0 2px";
      style.borderRadius = "2px";
      style.background = "transparent";
      style.textShadow = "0 0 2px #fff, 0 0 2px #fff";
      style.zIndex = "2";

      const nodeLeft = parseFloat(style.left);
      const nodeTop = parseFloat(style.top);
      if (Number.isNaN(nodeLeft) || Number.isNaN(nodeTop)) return;

      const dim = (Number(node.getData("dim")) || 4) * scale;
      domElement.dataset.nodeX = String(nodeLeft);
      domElement.dataset.nodeY = String(nodeTop);
      domElement.dataset.dim = String(dim);
      scheduleLayout();
    },
  });

  rgraph.loadJSON(json);

  // ✅ Thiết lập màu sắc node
  rgraph.graph.eachNode((n) => {
    n.setData("color", n.data.color);
    n.setData("dim", n.data.dim);
    n.setData("avg_attendance", n.data.avg_attendance);

    n.getPos().setc(-200, -200);
  });

  // ✅ Render
  rgraph.compute("end");
  rgraph.fx.animate({
    modes: ["polar"],
    duration: 2000,
    onComplete: () => layoutLabels(),
  });

  function canvasScale() {
    const scale = Number(rgraph.canvas?.scaleOffsetX);
    return Number.isFinite(scale) && scale > 0 ? scale : 1;
  }

  let layoutQueued = false;
  function scheduleLayout() {
    if (layoutQueued) return;
    layoutQueued = true;
    queueMicrotask(() => {
      layoutQueued = false;
      layoutLabels();
    });
  }

  function layoutLabels() {
    const host = document.getElementById(containerId);
    if (!host) return;

    const cx = host.clientWidth / 2;
    const cy = host.clientHeight / 2;
    const allowChip = canvasScale() >= 0.9;
    const labels = [...host.querySelectorAll<HTMLElement>(".node")];
    const placed: { l: number; t: number; r: number; b: number }[] = [];

    const items = labels
      .map((el) => {
        const nx = parseFloat(el.dataset.nodeX || "");
        const ny = parseFloat(el.dataset.nodeY || "");
        if (Number.isNaN(nx) || Number.isNaN(ny)) return null;
        el.style.padding = allowChip ? "0 3px" : "0";
        const dx = nx - cx;
        const dy = ny - cy;
        const dist = Math.hypot(dx, dy) || 1;
        return {
          el,
          nx,
          ny,
          w: el.offsetWidth,
          h: el.offsetHeight,
          ux: dx / dist,
          uy: dy / dist,
          dist,
          dim: Number(el.dataset.dim) || 4,
        };
      })
      .filter((item): item is NonNullable<typeof item> => !!item)
      .sort((a, b) => a.dist - b.dist);

    const hitsNode = (box: { l: number; t: number; r: number; b: number }) =>
      items.some((other) => {
        const rad = other.dim + 3;
        const px = Math.max(box.l, Math.min(other.nx, box.r));
        const py = Math.max(box.t, Math.min(other.ny, box.b));
        const ddx = px - other.nx;
        const ddy = py - other.ny;
        return ddx * ddx + ddy * ddy < rad * rad;
      });

    const hitsLabel = (box: { l: number; t: number; r: number; b: number }) =>
      placed.some((b) => !(box.r < b.l || box.l > b.r || box.b < b.t || box.t > b.b));

    for (const item of items) {
      let clearance = item.dim + 4;
      let left = item.nx;
      let top = item.ny;
      let clearOfDots = false;
      const maxClearance = item.dim + 80;

      for (let step = 0; step < 28; step++) {
        if (item.dist < 12) {
          left = item.nx - item.w / 2;
          top = item.ny + clearance;
        } else if (Math.abs(item.ux) >= Math.abs(item.uy)) {
          top = item.ny - item.h / 2;
          left = item.ux >= 0 ? item.nx + clearance : item.nx - clearance - item.w;
        } else {
          left = item.nx - item.w / 2;
          top = item.uy >= 0 ? item.ny + clearance : item.ny - clearance - item.h;
        }

        const box = { l: left, t: top, r: left + item.w, b: top + item.h };
        const blocked = hitsNode(box) || hitsLabel(box);
        if (!blocked) {
          clearOfDots = true;
          placed.push(box);
          break;
        }
        if (clearance >= maxClearance) break;
        clearance += Math.max(3, Math.round(item.h * 0.7));
      }

      if (!clearOfDots) {
        placed.push({ l: left, t: top, r: left + item.w, b: top + item.h });
      }

      const showChip = allowChip && clearOfDots;
      item.el.style.left = left + "px";
      item.el.style.top = top + "px";
      item.el.style.background = showChip ? "rgba(255,255,255,0.92)" : "transparent";
      item.el.style.padding = showChip ? "0 3px" : "0";
      item.el.style.textShadow = showChip
        ? "none"
        : "0 0 3px #fff, 0 0 3px #fff, 0 0 1px #fff";
    }
  }
}

// ✅ Render lại khi data có
// onMounted(async () => {
//   if (props.data) {
//     await nextTick();
//     renderGraph(props.data);
//     selectedChurchId.value = props.data.id
//   }
// });

const buckets = [
  { max: 50, dim: 3, color: "#C93C47" },        // đỏ nhạt
  { max: 150, dim: 3.8, color: "#58AC45" },       // xanh lá
  { max: 300, dim: 4.6, color: "#8FCAF0" },      // xanh da trời nhạt
  { max: 500, dim: 5.4, color: "#4687C1" },      // xanh da trời đậm
  { max: 1000, dim: 6.2, color: "#756CB7" },     // tím
  { max: 3000, dim: 7, color: "#D171B8" },     // hồng
  { max: Infinity, dim: 7.8, color: "#D1E015" }, // vàng
];

function buildDataForNode(node) {
  // const items = [50, 100, 200, 400, 700, 1001, 3000, 4000];
  // node.avg_attendance = items[Math.floor(Math.random() * items.length)];

  const avgAttendance = node.avg_attendance;
  const bucket = buckets.find(b => avgAttendance <= b.max);

  let dataColor = '#ccc';
  let dataDim = 8

  if (bucket) {
    dataDim = bucket.dim
    dataColor = bucket.color
  }
    
  node.data = {
    full_name: node.name,
    short_name: node.short_name,
    avg_attendance: node.avg_attendance,
    color: dataColor,
    dim: dataDim
  }

  node.backup_name = node.name
  node.name = node.short_name

  if (Array.isArray(node.children) && node.children.length > 0) {
    node.children.forEach(child => buildDataForNode(child));
  }
}

const fetchData = async (churchId) => {
  const rootNode = await graphService.getDataGenerationalGraph(churchId, false);
  buildDataForNode(rootNode);
  
  data.value = rootNode;
  await nextTick();
  renderGraph(data.value);
  selectedChurchId.value = churchId
}

watch(
  () => props.churchId,
  async (val) => {
    if (val) {
      fetchData(val)
    }
  },
  { immediate: true }
);

const rows = [
  {
    "label": "report.adult",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.adult_attendance || 0), 0) || '-'
  },
  {
    "label": "report.youth",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.youth_attendance || 0), 0) || '-'
  },
  {
    "label": "report.children",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.child_attendance || 0), 0) || '-'
  },
  {
    "label": "report.totalAttendance",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.total_attendance || 0), 0) || '-',
    "classes": ['summary-class']
  },
  {
    "label": "report.numberCellGroups",
    "fn": (r) => r?.church_metrics?.number_of_cell_groups || '-'
  },
  {
    "label": "report.totalCellAttendance",
    "fn": (r) => r?.church_metrics?.cell_group_weekly_attendance || '-',
    "classes": ['summary-class']
  },
  {
    "label": "report.newDecisions",
    "fn": (r) => r?.church_metrics?.weekly_decisions_made || '-'
  },
  {
    "label": "report.activelyDiscipled",
    "fn": (r) => r?.church_metrics?.being_actively_discipled || '-'
  },
  {
    "label": "report.waterBaptised",
    "fn": (r) => r?.church_metrics?.weekly_water_baptism || '-'
  },
  {
    "label": "report.liwClasses",
    "fn": (r) => r?.church_metrics?.number_of_liw_classes || '-'
  },
  {
    "label": "report.liwStudents",
    "fn": (r) => r?.church_metrics?.liw_total_students || '-',
    "classes": ['summary-class']
  },
  {
    "label": "report.numberLeaders",
    "fn": (r) => r?.church_metrics?.number_of_leaders_in_training_for_cpm || '-'
  },
  {
    "label": "report.tithesOfferings",
    "classes": ['summary-class'],
    "fn": (r) => formatLocalWithUsd(
      r?.church_metrics?.giving_in_local_currency,
      r?.church_metrics?.giving_in_usd,
    )
  },
  {
    "label": "report.missionMfpGiving",
    "classes": ['summary-class'],
    "fn": (r) => formatLocalWithUsd(
      r?.church_metrics?.mfp_in_local_currency,
      r?.church_metrics?.mfp_in_usd,
    )
  },
]

function formatLocalWithUsd(localAmount: unknown, usdAmount: unknown) {
  if (!localAmount && !usdAmount) return '-'

  const localFormatted = formatCurrency(localAmount as number, selectedChurch.value?.currency_name)
  const usdFormatted = formatCurrency(usdAmount as number, 'USD')
  if (!usdFormatted) return localFormatted || '-'

  return `${localFormatted} (${usdFormatted})`
}

const showWeekRange = (year, week) => {
  const [startDate, endDate] = getISOWeekRange(year, week)

  const formattedStartDate = formatDate(startDate, 'DD MMM')
  const formattedEndDate = formatDate(endDate, 'DD MMM ’YY')
  return t('report.rangeDateOfWeek', { start: formattedStartDate, end: formattedEndDate })
}
const fetchChurchReport = async (churchId) => {
  data4Weeks.value = await reportService.getLast4WeeksOfChurch(churchId)
}
const fetchChurchDetail = async (churchId) => {
  selectedChurch.value = await churchService.get(churchId)
}
watch(
  () => selectedChurchId.value,
  async (val) => {
    if (val) {
      fetchChurchReport(val)
      fetchChurchDetail(val)
    }
  },
  { immediate: true }
);

function formatRange(bucket: any, index: number) {
  if (bucket.max === Infinity) return "3,000+"
  const min = index === 0 ? 0 : buckets[index - 1].max
  return `${min + 1} – ${bucket.max}`
}

function legendDotSize(dim: number) {
  return Math.round(8 + (dim - 3) * 2.4)
}

</script>

<template>
  <v-container>
    <!-- Legend -->
    <!-- Quote + Legend row -->
<v-row dense class="mb-4 align-center">
  <v-col
    cols="12"
    class="d-flex justify-end"
  >
    <div class="chart-legend-wrap">
      <div class="chart-legend-title">{{ $t("chart.churchSize") }}</div>
      <div class="chart-legend">
        <div
          v-for="(bucket, index) in buckets"
          :key="index"
          class="legend-item"
        >
          <span class="legend-dot-slot">
            <span
              class="legend-dot"
              :style="{
                backgroundColor: bucket.color,
                width: `${legendDotSize(bucket.dim)}px`,
                height: `${legendDotSize(bucket.dim)}px`,
              }"
            />
          </span>
          <span class="legend-label">
            {{ formatRange(bucket, index) }}
          </span>
        </div>
      </div>
    </div>
  </v-col>
</v-row>

     <!-- #Legend -->
    <div
      id="infovis"
      class="jit-chart"
      style="width: 100%; height: 600px; position: relative;"
    ></div>

    <h3 class="mt-5 text-h4">{{ $t('chart.last4WeeksDetail') }}</h3>
    <p class="text-title-small"><b>{{ $t('chart.selectedChurch') }}</b>: 
      <router-link
         v-if="selectedChurchId"
         color="primary"
              variant="text"
              :to="{name: 'ChurchDetail',  params: { id: selectedChurchId }}"
          target="_blank"
          rel="noopener noreferrer"
          >
          {{ selectedChurch?.name }}
        </router-link>
      </p>
    <p class="mb-5 text-title-small"><b>{{ $t('chart.selectedPastorLeader') }}</b>: 
      <router-link
         v-if="selectedChurch?.pastor_id"
         color="primary"
              variant="text"
              :to="{name: 'UserDetail',  params: { id: selectedChurch?.pastor_id }}"
          target="_blank"
          rel="noopener noreferrer"
          >
          {{ selectedChurch?.pastor_name }}
        </router-link>
      </p>
    <v-table class="striped-table" density="compact">
      <thead>
        <tr>
          <th class="font-weight-bold text-center">{{ $t('chart.weekYear') }}</th>
          <th class="font-weight-bold text-center" v-for="col in data4Weeks" :key="`${col.year}-${col.weekNumber}`" v-html="showWeekRange(col.year, col.week_number)">
            
          </th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in rows" :key="index" :class="row?.classes || [] ">
        <td class="font-weight-bold" v-if="row.label === 'report.localGiving'">{{ $t(row.label, {localCurrencyCode: selectedChurch?.currency_name}) }}:</td>
        <td class="font-weight-bold" v-else>{{ $t(row.label) }}:</td>
        
        <td class="text-center" v-for="col in data4Weeks" :key="`${col.year}-${col.weekNumber}`">{{ row?.fn ? row.fn(col) : null }}</td>
      </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<style scoped lang="scss">
.jit-chart {
  border: 1px solid rgba(0, 0, 0, 0.06);
}

// .striped-table {
//   line-height: 1.1;
// }
//   .striped-table tbody tr:nth-child(odd) {
//   background-color: #fafafa;
// }
// .striped-table tbody tr:nth-child(even) {
//   background-color: #f0f0f0;
// }

// .striped-table :deep(.v-data-table__td),
// .striped-table :deep(.v-data-table__th) {
//   border-bottom: 1px solid rgba(0, 0, 0, 0.15);
// }

/* wrapper + border ngoài */
.striped-table {
  line-height: 1.1;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  overflow: hidden; /* rất quan trọng */
}

/* header background + line */
.striped-table :deep(thead th) {
  background-color: #e9ecef; /* đậm hơn chút */
  font-weight: 600;
  border-bottom: 2px solid rgba(0, 0, 0, 0.35);
  padding: 6px 8px;
}

/* body cells + kẻ ngang */
.striped-table :deep(tbody td) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 4px 8px;
}

/* zebra rows */
.striped-table :deep(tbody tr:nth-child(odd)) {
  background-color: #fafafa;
}

.striped-table :deep(tbody tr:nth-child(even)) {
  background-color: #f0f0f0;
}

/* bỏ line hàng cuối cho gọn */
.striped-table :deep(tbody tr:last-child td) {
  border-bottom: none;
}

.summary-class {
  font-weight: bold;
  color: rgb(var(--v-theme-primary));
}

.chart-legend-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: max-content;
  max-width: 100%;
}

.chart-legend-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  color: rgba(var(--v-theme-on-surface), 0.9);
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot-slot {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.legend-dot {
  border-radius: 50%;
  display: block;
}

.legend-label {
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  color: rgba(var(--v-theme-on-surface), 0.75);
}
</style>