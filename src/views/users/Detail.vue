<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import TablePageShell from "@/components/shared/TablePageShell.vue";
import UserDetailWidget from "@/components/widgets/UserDetailWidget.vue";
import ChurchInfoWidget from "@/components/widgets/ChurchInfoWidget.vue";
import { ROLE_PASTOR_LEADER } from "@/constants/roleConstant";

const route = useRoute();
const id = route.params.id as string;
const user = ref<Record<string, any> | null>(null);

const isPastorLeader = computed(
  () => Number(user.value?.role?.id) === ROLE_PASTOR_LEADER,
);

const fromChurches = computed(() => {
  const churches = user.value?.from_churches;
  return Array.isArray(churches) ? churches : [];
});

function onUserLoaded(detail: Record<string, any>) {
  user.value = detail;
}
</script>

<template>
  <TablePageShell
    title-key="pageTitle.userDetail"
    :back-url="{ name: 'UserList' }"
    :with-card="false"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <UserDetailWidget
          :user-id="id"
          @loaded="onUserLoaded"
        />
      </v-col>

      <v-col
        v-if="isPastorLeader && fromChurches.length"
        cols="12"
        md="6"
      >
        <div class="d-flex flex-column ga-4">
          <ChurchInfoWidget
            v-for="church in fromChurches"
            :key="church.id"
            :church="church"
          />
        </div>
      </v-col>
    </v-row>
  </TablePageShell>
</template>
