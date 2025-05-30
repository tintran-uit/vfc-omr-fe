<script setup lang="ts">
import {ref, defineEmits} from "vue";
import {Form} from "vee-validate";
import VeeValidation from "@/components/forms/validation/VeeValidation.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";

const schema = defineProps(['schema'])

</script>

<template>
      <UiParentCard>
        <Form>
          <v-row>
            <template v-for="field in schema.schema.fields">
                <v-col v-if="field.groupTitle" cols="12">
                  <h3>1. Main Worship Service Attendance</h3>
                </v-col>

                <v-col cols="6">
                  <v-label class="text-wrap">Adults</v-label>
                  <v-text-field
                    v-model="model.xxx"
                    type="number"
                    hide-details="auto"
                    required
                    variant="outlined"
                    class="mt-2"
                    color="primary"
                    placeholder=""
                  />
                </v-col>

                <v-col cols="6">
                  <v-label class="text-wrap">Adults</v-label>
                  <v-text-field
                    v-model="model.xxx"
                    type="number"
                    hide-details="auto"
                    required
                    variant="outlined"
                    class="mt-2"
                    color="primary"
                    placeholder=""
                  />
                </v-col>

                <v-col cols="6">
                  <v-label class="text-wrap">Adults</v-label>
                  <v-text-field
                    v-model="model.xxx"
                    type="number"
                    hide-details="auto"
                    required
                    variant="outlined"
                    class="mt-2"
                    color="primary"
                    placeholder=""
                  />
                </v-col>

                <v-col cols="6">
                  <v-label class="text-wrap">Adults</v-label>
                  <v-text-field
                    v-model="model.xxx"
                    type="number"
                    hide-details="auto"
                    required
                    variant="outlined"
                    class="mt-2"
                    color="primary"
                    placeholder=""
                  />
                </v-col>
              </template>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn color="primary" block class="mt-4" variant="flat" @click="">Save</v-btn>
                </v-col>
              </v-row>
        </Form>
      </UiParentCard>
</template>

<style scoped lang="scss">

</style>