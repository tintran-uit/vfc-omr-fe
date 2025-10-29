<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useTheme } from 'vuetify'

// ✅ Định nghĩa kiểu dữ liệu
interface ChurchNode {
  name: string
  attendance: number
  children?: ChurchNode[]
}

// ✅ Props
const props = defineProps<{
  data: ChurchNode
}>()

// ✅ Emits
const emit = defineEmits<{
  (e: 'node-click', node: ChurchNode): void
}>()

// ✅ Refs
const chartRef = ref<HTMLDivElement | null>(null)
const theme = useTheme()

// ✅ Biến toàn cục JIT
declare global {
  interface Window {
    $jit: any
  }
}

let jitGraph: any = null

// ===============================
// 🎯 HÀM TÁCH RIÊNG LOGIC TOOLTIP
// ===============================
function getTooltipContent(node: { name: string; data: { attendance: number } }): string {
  return `
    <div style="padding:4px 8px; color:#fff;">
      <strong>${node.name}</strong><br/>
      Attendance: ${node.data.attendance ?? 'N/A'}
    </div>
  `
}

// ===============================
// 🎨 HÀM TÍNH MÀU THEO ATTENDANCE
// ===============================
function getColor(attendance: number): string {
  if (attendance < 50) return '#C93C47'
  if (attendance < 150) return '#58AC45'
  if (attendance < 300) return '#8FCAF0'
  if (attendance < 500) return '#4687C1'
  if (attendance < 1000) return '#756CB7'
  if (attendance < 3000) return '#D171B8'
  return '#D1E015'
}

// ===============================
// 🔵 HÀM TÍNH KÍCH THƯỚC NODE
// ===============================
function getNodeSize(attendance: number): number {
  const min = 6
  const max = 30
  const value = Math.min(attendance || 0, 3000)
  return min + (max - min) * (value / 3000)
}

// ===============================
// 🔁 CHUYỂN DATA VỀ ĐỊNH DẠNG JIT
// ===============================
function convertToJitData(node: ChurchNode): any {
  return {
    id: node.name,
    name: node.name,
    data: { attendance: node.attendance },
    children: (node.children || []).map((child) => convertToJitData(child)),
  }
}

// ===============================
// 🧠 KHỞI TẠO VÀ RENDER CHART
// ===============================
function renderChart(): void {
  if (!chartRef.value || !window.$jit) return

  // Xóa chart cũ
  chartRef.value.innerHTML = ''

  const jitData = convertToJitData(props.data)

  // Tạo SpaceTree
  jitGraph = new window.$jit.ST({
    injectInto: chartRef.value,
    orientation: 'top',
    levelDistance: 60,
    siblingOffset: 12,
    duration: 600,
    transition: window.$jit.Trans.Quart.easeInOut,

    // Node style
    Node: {
      height: 0,
      width: 0,
      type: 'circle',
      color: '#ccc',
      overridable: true,
    },

    // Edge style
    Edge: {
      type: 'bezier',
      color: '#aaa',
      overridable: true,
    },

    // ==============================
    // 🎨 CẤU HÌNH NODE / LABEL / TOOLTIP
    // ==============================

    onCreateLabel(label: HTMLElement, node: any) {
      label.innerHTML = node.name
      label.onclick = () => {
        const clickedNode: ChurchNode = {
          name: node.name,
          attendance: node.data.attendance,
        }
        emit('node-click', clickedNode)
      }
      label.style.cursor = 'pointer'
      label.style.fontSize = '0.8em'
      label.style.textAlign = 'center'
      label.style.color = theme.current.value.colors.onBackground || '#000'
    },

    onBeforePlotNode(node: any) {
      const att = node.data.attendance ?? 0
      node.data.$color = getColor(att)
      node.data.$dim = getNodeSize(att)
    },

    Tips: {
      enable: true,
      onShow(tip: HTMLElement, node: any) {
        tip.innerHTML = getTooltipContent({
          name: node.name,
          data: node.data,
        })
      },
    },
  })

  // Render
  jitGraph.loadJSON(jitData)
  jitGraph.compute()
  jitGraph.onClick(jitGraph.root)
}

// ===============================
// 👀 THEO DÕI DATA & RENDER
// ===============================
watch(
  () => props.data,
  async () => {
    await nextTick()
    renderChart()
  },
  { immediate: true }
)

onMounted(() => {
  renderChart()
})
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 600px;" class="jit-chart"></div>
</template>
