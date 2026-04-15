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
    background: { CanvasStyles: { strokeStyle: "#ccc" } },
    Navigation: { enable: true, panning: true, zooming: 10 },
    Node: { overridable: true },
    Edge: { color: "#888", lineWidth: 1.2 },

    onCreateLabel(domElement, node) {
      domElement.innerHTML = node.name;
      domElement.style.cursor = "pointer";

      domElement.onclick = async () => {
        rgraph.onClick(node.id, { hideLabels: false });

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
      // 🛡️ Bảo vệ khi node chưa render xong
      if (!domElement || !domElement.style) return;

      const style = domElement.style;
      style.fontSize = node._depth <= 1 ? "0.8em" : "0.7em";
      style.color = "#333";

      // 🧩 Đợi offsetWidth có giá trị
      const trySetPosition = () => {
        const w = domElement.offsetWidth;
        const leftVal = parseInt(style.left);
        if (!w || isNaN(leftVal)) {
          requestAnimationFrame(trySetPosition);
          return;
        }
        style.left = leftVal - w / 2 + "px";
      };
      trySetPosition();
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
  rgraph.fx.animate({ modes: ["polar"], duration: 2000 });
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
    "fn": (r) => r?.church_metrics?.liw_total_students || '-'
  },
  {
    "label": "report.numberLeaders",
    "fn": (r) => r?.church_metrics?.number_of_leaders_in_training_for_cpm || '-'
  },
  {
    "label": "report.tithesOfferings",
    "fn": (r) => {
      if(!r?.church_metrics?.giving_in_local_currency && !r?.church_metrics?.giving_in_usd) return '-'

      const localFomatted = formatCurrency(r?.church_metrics?.giving_in_local_currency, selectedChurch.value?.currency_name)
      const usdFormatted = formatCurrency(r?.church_metrics?.giving_in_usd, 'USD')

      return `${localFomatted} (${usdFormatted})`;
    }
  },
  {
    "label": "report.missionMfpGiving",
    "fn": (r) => {
      if(!r?.church_metrics?.mfp_in_local_currency && !r?.church_metrics?.mfp_in_usd) return '-'

      const localFomatted = formatCurrency(r?.church_metrics?.mfp_in_local_currency, selectedChurch.value?.currency_name)
      const usdFormatted = formatCurrency(r?.church_metrics?.mfp_in_usd, 'USD')

      return `${localFomatted} (${usdFormatted})`;
    }
  },
]

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

</script>

<template>
  <v-container>
    <!-- Legend -->
    <!-- Quote + Legend row -->
<v-row dense class="mb-4 align-center">
  <!-- Scripture quote -->
  <v-col cols="12" md="8">
    <blockquote class="scripture-quote">
      <p class="scripture-text">
        “{{ $t('chart.bibleVerse') }}”
      </p>
      <footer class="scripture-ref">
        — {{ $t('chart.bibleReference') }}
      </footer>
    </blockquote>
  </v-col>

  <!-- Legend -->
  <v-col
    cols="12"
    md="4"
    class="d-flex justify-end"
  >
    <div class="chart-legend">
      <div
        v-for="(bucket, index) in buckets"
        :key="index"
        class="legend-item"
      >
        <span
          class="legend-dot"
          :style="{
            backgroundColor: bucket.color,
            width: `${bucket.dim * 2}px`,
            height: `${bucket.dim * 2}px`,
          }"
        />
        <span class="legend-label">
          {{ formatRange(bucket, index) }}
        </span>
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

.scripture-quote {
  margin: 0;
  padding-left: 16px;
  border-left: 3px solid rgba(0, 0, 0, 0.12);
}

.scripture-text {
  font-size: 14px;
  font-style: italic;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.78);
  margin: 0;
}

.scripture-ref {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.54);
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px 16px;
  max-width: 360px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 12px;
  white-space: nowrap;
}
</style>