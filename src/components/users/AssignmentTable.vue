<script setup lang="ts">
defineProps<{
  items: Array<{ id: number; name: string }>;
}>();

defineEmits<{
  remove: [id: number];
}>();
</script>

<template>
  <v-table
    density="compact"
    class="bordered-table"
  >
    <thead>
      <tr>
        <th class="assignment-table__id">ID</th>
        <th>{{ $t("user.labelName") }}</th>
        <th class="text-end assignment-table__remove">
          {{ $t("user.assignRemove") }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!items.length">
        <td
          colspan="3"
          class="text-center text-medium-emphasis"
        >
          {{ $t("noData") }}
        </td>
      </tr>
      <tr
        v-for="item in items"
        :key="item.id"
      >
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td class="text-end">
          <v-btn
            icon="$delete"
            variant="text"
            size="small"
            color="error"
            @click="$emit('remove', item.id)"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped lang="scss">
.assignment-table__id {
  width: 88px;
}

.assignment-table__remove {
  width: 96px;
}
</style>
