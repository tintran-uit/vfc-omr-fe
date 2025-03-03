<script setup lang="ts">
import { computed, shallowRef, watch, ref } from 'vue';
import { useTheme } from 'vuetify';

import { MoreOutlined } from '@ant-design/icons-vue';
import CardHeader from '@/components/shared/CardHeader.vue';

const theme = useTheme();
const successColor = theme.current.value.colors.success;
const warningColor = theme.current.value.colors.warning;
const errorColor = theme.current.value.colors.error;
const currentTheme = ref(theme.current.value.colors);

// Watch for changes in lightprimary color
watch(
  () => ({
    lightprimary: theme.current.value.colors.lightprimary
  }),
  (newColors) => {
    // Update currentTheme values when changes are detected
    currentTheme.value = {
      ...currentTheme.value,
      lightprimary: newColors.lightprimary
    };
  }
);

const chartOptions = computed(() => {
  const lightprimaryColor = currentTheme.value.lightprimary;

  return {
    chart: {
      type: 'donut',
      height: 230,
      fontFamily: `inherit`
    },
    colors: [warningColor, successColor, errorColor, lightprimaryColor],
    plotOptions: {
      donut: {
        size: '15%'
      }
    },
    stroke: {
      width: 0
    },
    labels: ['Pending', 'Paid', 'Overdue', 'Draft'],
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          }
        }
      }
    ]
  };
});

const redialChart = {
  series: [30, 28, 22, 20]
};

const Expensedata = shallowRef([
  {
    status: 'Pending',
    color: 'warning',
    price: '$329.20'
  },
  {
    status: 'Paid',
    color: 'success',
    price: '$45,050'
  },
  {
    status: 'Overdue',
    color: 'error',
    price: '$25,000'
  },
  {
    status: 'Draft',
    color: 'lightprimary',
    price: '$7,694'
  }
]);
</script>

<template>
  <CardHeader title="Total Expenses" class="overflow-hidden">
    <template v-slot:header>
      <v-btn variant="text" color="secondary" icon rounded size="small">
        <MoreOutlined :style="{ fontSize: '18px' }" />
      </v-btn>
    </template>
    <div class="pa-5">
      <apexchart type="donut" height="230" :options="chartOptions" class="invoiceChart" :series="redialChart.series"> </apexchart>
      <v-list density="compact" class="pb-0" aria-label="expense list" aria-busy="true">
        <v-list-item v-for="(item, i) in Expensedata" :key="i" class="pa-0">
          <h6 class="text-subtitle-1 text-lightText mb-0">
            <v-badge dot :color="item.color" size="large" inline> </v-badge>
            {{ item.status }}
          </h6>
          <template v-slot:append>
            <h5 class="text-h5 font-weight-medium mb-0">{{ item.price }}</h5>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </CardHeader>
</template>
<style lang="scss">
.invoiceChart {
  .apexcharts-canvas {
    margin: 0 auto;
  }
  .apexcharts-tooltip {
    &.apexcharts-theme-dark {
      .apexcharts-tooltip-series-group {
        &.apexcharts-tooltip-series-group-3 {
          .apexcharts-tooltip-text {
            color: rgb(var(--v-theme-darkText));
          }
        }
      }
    }
  }
}
</style>
