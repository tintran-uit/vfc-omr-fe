<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { createFormSchema } from '@/form-schemas/editUserFormSchema';
import { userService } from '@/services/userService';
import PastorLeaderWidget from '@/components/widgets/PastorLeaderWidget.vue';
import ChurchDetailWidget from '@/components/widgets/ChurchDetailWidget.vue';
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const options = ref({});
const id = route.params.id as string;
const editData = ref(null);
const formSchema = createFormSchema();

const fetchData = async function (id) {
  if (!id) return;
  try {
    const user = await userService.getById(id);
    
  } catch (e) {
    console.log('error', e);
  }
}

onMounted(() => {
  fetchData(id);
});
</script>

<template>
    <!-- Main Content -->
    <v-sheet color="grey lighten-4" class="pa-8">
      <v-row>
        <v-col cols="12" class="d-flex align-center justify-space-between">
          <h1>{{ $t('user.editTitle', {id: id}) }}</h1>

          <v-btn 
            color="primary" 
            variant="outlined" 
            @click="router.push({ name: 'UserList' })"
          >
            <v-icon>$arrowLeft</v-icon> {{ $t('backToList') }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- ChurchDetail & PastorLeader -->
    <v-row>
      <v-col cols="12" md="6">
        <PastorLeaderWidget :user="churchDetail?.pastor_id" :title="$t('user.accountDetails')" />
      </v-col>
      <v-col cols="12" md="6">
        <!-- <template v-for="church in churches">
          <ChurchDetailWidget :church-id="churchDetail?.id" />
        </template> -->
      </v-col>  
    </v-row>
    <!-- #ChurchDetail & PastorLeader -->
    </v-sheet>
</template>

<style scoped lang="scss">

</style>