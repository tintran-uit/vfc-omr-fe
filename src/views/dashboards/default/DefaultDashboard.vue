<script setup lang="ts">
// imported components
import RecentOrder from './components/RecentOrder.vue';
import TransactionHistory from './components/TransactionHistory.vue';
import HelpSupport from './components/HelpSupport.vue';
import WidgetFive from '../../widgets/statistics/components/WidgetFive.vue';
import UniqueVisitor from '../../widgets/chart/components/UniqueVisitor.vue';
import IncomeOverview from '../../widgets/chart/components/IncomeOverview.vue';
import AnalyticsReport from './components/AnalyticsReport.vue';
import SalesReport from '../../widgets/chart/components/SalesReport.vue';
import Attendance from '../../widgets/chart/components/Attendance.vue';
import Pie from '../../widgets/chart/components/Pie.vue';
</script>

<template>
  <v-card class="pa-0" flat>
    <!-- Cover Image -->
    <v-img
        src="https://placehold.co/1200x300.jpg?text=Cover%20(1200x300)"
        height="300"
        cover
    ></v-img>

    <!-- Avatar + Info -->
    <v-container class="position-relative" style="margin-top: -80px;">
      <v-row align="center">
        <!-- Avatar -->
        <v-col cols="12" sm="3" class="d-flex justify-center">
          <v-avatar size="160" class="elevation-4">
            <v-img src="https://placehold.co/128x128.png?text=Avatar%20(128x128)" />
          </v-avatar>
        </v-col>

        <!-- User Info -->
        <v-col cols="12" sm="6">
          <h2 class="text-h5 font-weight-bold mb-1">Tên người dùng</h2>
          <p class="text-subtitle-2 text-grey">Mô tả ngắn hoặc thông tin khác</p>
        </v-col>

        <!-- Edit Button -->
        <v-col cols="12" sm="3" class="d-flex justify-end">
          <v-btn variant="outlined" color="primary" prepend-icon="mdi-pencil">
            Chỉnh sửa
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <!-- -------------------------------------------------------------------- -->
  <!-- Total widgets -->
  <!-- -------------------------------------------------------------------- -->
  <WidgetFive />

  <v-row class="mb-0">
    <!-- -------------------------------------------------------------------- -->
    <!-- Unique visitor -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="8">
      <Attendance />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Income overview -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <Pie />
    </v-col>
  </v-row>
  <v-row class="mb-0">
    <!-- -------------------------------------------------------------------- -->
    <!-- Recent order -->
    <!-- -------------------------------------------------------------------- -->
    <!-- <v-col cols="12" md="8">
      <RecentOrder />
    </v-col> -->

    <!-- -------------------------------------------------------------------- -->
    <!-- Analytics Report -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <!-- <AnalyticsReport /> -->
    </v-col>
  </v-row>
  <v-row>
    <!-- -------------------------------------------------------------------- -->
    <!-- Sales Report -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="7">
      <!-- <SalesReport /> -->
    </v-col>

    <v-col cols="12" md="5">
      <v-row>
        <!-- -------------------------------------------------------------------- -->
        <!-- Transaction History -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12">
          <!-- <TransactionHistory /> -->
        </v-col>

        <!-- -------------------------------------------------------------------- -->
        <!-- Help support -->
        <!-- -------------------------------------------------------------------- -->
        <v-col cols="12">
          <!-- <HelpSupport /> -->
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
