<script setup lang="ts">
import {ref} from "vue";
import {Form} from "vee-validate";
import VeeValidation from "@/components/forms/validation/VeeValidation.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";


</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <UiParentCard title="On Type">
        <Form>
          <template v-for="field in fields">
            <h5 v-if="field.groupTitle">{{field.groupTitle}}</h5>

            <div v-if="field.type === 'hihi'">

            </div>
            <v-label class="mb-1">First name</v-label>
            <v-text-field
                v-else
                v-model="firstname"
                :rules="field.rules"
                single-line
                variant="outlined"
                :color="firstname.length > 2 ? 'success' : 'primary'"
                class="mb-3"
            ></v-text-field>
          </template>
        </Form>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>