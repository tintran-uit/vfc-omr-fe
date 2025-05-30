<script setup lang="ts">
import { computed, ref, watch } from 'vue';


import VueApexCharts from 'vue3-apexcharts'

const series = [45, 30, 25] // ví dụ: số lượng Người lớn, Thanh niên, Thiếu nhi

const chartOptions = {
  labels: ['Người lớn', 'Thanh Niên', 'Thiếu Nhi'],
  title: {
    text: 'Tỉ lệ người tham dự buổi nhóm',
    align: 'center',
    style: {
      fontSize: '18px',
      fontWeight: 'bold'
    }
  },
  legend: {
    position: 'bottom'
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val.toFixed(1) + '%'
    }
  }
}
</script>

<template>
  <apexchart type="pie" :options="chartOptions" :series="series" />
</template>


<style scoped>
.chart-container {
  width: 100%;
  max-width: 400px; /* optional, để giới hạn chiều rộng tối đa */
  margin: auto;
}
</style>