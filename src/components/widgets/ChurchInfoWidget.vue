<script setup lang="ts">
defineProps<{
  church: {
    id: number;
    name: string;
  };
}>();

const headingClass = "text-left font-weight-medium";
</script>

<template>
  <v-card
    variant="outlined"
    elevation="0"
    class="bg-surface"
  >
    <v-card-item class="bg-grey-lighten-4">
      <div class="d-flex align-center ga-2">
        <v-icon
          icon="$accountGroup"
          color="primary"
        />
        <v-card-title class="text-h5 text-high-emphasis pa-0">
          {{ $t("user.pastorAssistAdminOf") }}
        </v-card-title>
      </div>
    </v-card-item>

    <v-divider />

    <v-table
      class="bordered-table table-in-card table-key-value"
      density="compact"
    >
      <tbody>
        <tr>
          <th :class="headingClass">
            {{ $t("church.labelName") }}
          </th>
          <td>
            <router-link
              :to="{ name: 'ChurchDetail', params: { id: church.id } }"
            >
              {{ church.name }}
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>
