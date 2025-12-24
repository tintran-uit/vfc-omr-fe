<script setup lang="ts">
import { onMounted, watch, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import { reportService } from "@/services/reportService";
import { churchService } from "@/services/churchService";
import { getWeekRange } from "@/helpers/dateTimeHelper";
import { graphService } from '@/services/graphService';
import { formatNumber, formatCurrency } from "@/helpers/appHelper";

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
          <b>${node.name}</b><br/>
          ${t("chart.averageAttendance")}: ${data.avg_attendance ?? "N/A"}<br/>
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
  { max: 50, dim: 6, color: "#C93C47" },        // đỏ nhạt
  { max: 150, dim: 6.5, color: "#58AC45" },       // xanh lá
  { max: 300, dim: 7, color: "#8FCAF0" },      // xanh da trời nhạt
  { max: 500, dim: 7.5, color: "#4687C1" },      // xanh da trời đậm
  { max: 1000, dim: 8, color: "#756CB7" },     // tím
  { max: 3000, dim: 8.5, color: "#D171B8" },     // hồng
  { max: Infinity, dim: 9, color: "#D1E015" }, // vàng
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
    avg_attendance: node.avg_attendance,
    color: dataColor,
    dim: dataDim
  }

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
    "label": "Adult",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.adult_attendance || 0), 0) || '-'
  },
  {
    "label": "Youth [13-18]",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.youth_attendance || 0), 0) || '-'
  },
  {
    "label": "Children [0-12]",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.child_attendance || 0), 0) || '-'
  },
  {
    "label": "Total Attendance",
    "fn": (r) => r?.worship_sessions?.reduce((acc, session) => acc + (session.attendance.total_attendance || 0), 0) || '-',
    "classes": ['summary-class']
  },
  {
    "label": "No. of Cell Groups",
    "fn": (r) => r?.weekly_church_events?.cell_group_count || '-'
  },
  {
    "label": "Total Cell Attendance",
    "fn": (r) => r?.weekly_church_events?.cell_group_weekly_attendance || '-',
    "classes": ['summary-class']
  },
  {
    "label": "New Decisions",
    "fn": (r) => r?.weekly_spiritual_growth?.new_decisions || '-'
  },
  {
    "label": "Actively Discipled",
    "fn": (r) => r?.weekly_spiritual_growth?.active_disciples || '-'
  },
  {
    "label": "Water Baptised",
    "fn": (r) => r?.weekly_spiritual_growth?.water_baptisms || '-'
  },
  {
    "label": "LIW Classes",
    "fn": (r) => r?.weekly_church_events?.liw_class_count || '-'
  },
  {
    "label": "LIW Students",
    "fn": (r) => r?.weekly_church_events?.liw_class_total_students || '-'
  },
  {
    "label": "No. of Leaders",
    "fn": (r) => r?.weekly_spiritual_growth?.number_of_leaders_in_training_for_cpm || '-'
  },
  {
    "label": "Local Giving VND",
    "fn": (r) => r?.givings?.in_local_currency ? formatNumber(r?.givings?.in_local_currency) : '-'
  },
  {
    "label": "Local Giving USD",
    "fn": (r) => r?.givings?.in_usd ? formatNumber(r?.givings?.in_usd) : '-'
  },
]

const showWeekRange = (year, weekNumber) => {
  const [start, end] = getWeekRange(year, weekNumber, 'DD MMM')

  return t('report.rangeDateOfWeek', { start, end, weekNumber, year })
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
</script>

<template>
  <v-container>
    <div
      id="infovis"
      class="jit-chart"
      style="width: 100%; height: 600px; position: relative;"
    ></div>

    <p class="mt-5">Selected Church: {{ selectedChurch?.name }}</p>
    <p>Selected Pastor/Leader: {{ selectedChurch?.pastor_name }}</p>
    <p>Maturity: {{ selectedChurch?.church_type_name }}</p>
    <v-table class="elevation-1 striped-table">
      <thead>
        <tr>
          <th class="font-weight-bold text-center">Week, Year</th>
          <th class="font-weight-bold text-center" v-for="col in data4Weeks" :key="`${col.year}-${col.weekNumber}`" v-html="showWeekRange(col.year, col.week_number)">
            
          </th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in rows" :key="index" :class="row?.classes || [] ">
        <td class="font-weight-bold">{{ row.label }}:</td>
        <td class="text-center" v-for="col in data4Weeks" :key="`${col.year}-${col.weekNumber}`">{{ row?.fn ? row.fn(col) : null }}</td>
      </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<style scoped lang="scss">
.striped-table {
  line-height: 1.1;
}
  .striped-table tbody tr:nth-child(odd) {
  background-color: #fafafa;
}
.striped-table tbody tr:nth-child(even) {
  background-color: #f0f0f0;
}

.summary-class {
  background-color: #DEE9F7 !important;
}
</style>