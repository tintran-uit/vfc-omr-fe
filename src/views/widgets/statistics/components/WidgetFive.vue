<script setup lang="ts">
import { shallowRef } from 'vue';

// icons
import { RiseOutlined, FallOutlined, BankOutlined, UsergroupAddOutlined, MoneyCollectFilled } from '@ant-design/icons-vue';

const fivecards = shallowRef([
  {
    name: 'Church Plants',
    earn: '120',
    percent: null,
    color: 'primary',
    icon: BankOutlined,
    text: null
  },
  {
    name: 'People',
    earn: '1,500',
    percent: '',
    color: 'primary',
    icon: UsergroupAddOutlined,
    text: null
  },
  {
    name: 'Giving',
    earn: '50,000',
    percent: null,
    color: 'primary',
    icon: MoneyCollectFilled,
    text: null
  },
  {
    name: 'Growth',
    earn: '$35,078',
    percent: '4%',
    color: 'primary',
    icon: RiseOutlined,
    text: null
  }
]);
</script>
<template>
  <v-row class="my-0">
    <v-col cols="12" sm="6" md="3" v-for="(card5, i) in fivecards" :key="i" :value="card5">
      <v-card elevation="0" class="h-100">
        <v-card variant="outlined" class="h-100">
          <v-card-text class="h-100">
            <div class="d-flex align-items-center justify-space-between">
              <v-row class="mb-0">
                <v-col cols="3">
                  <component :is="card5.icon" :style="{ fontSize: '25px', verticalAlign: 'middle' }" :class="'me-1 text-' + card5.color" />
                </v-col>

                <v-col cols="7">
                    <h6 class="text-h6 text-lightText mb-1">{{ card5.name }}</h6>
                    <h4 class="text-h4 d-flex align-center mb-0">
                      {{ card5.earn }}
                    </h4>
                    <!-- <span class="text-lightText text-caption pt-5 d-block"
                      >You made an extra <span :class="'text-' + card5.color">{{ card5.text }}</span> this year</span
                    > -->
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>
