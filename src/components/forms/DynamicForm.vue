<script setup lang="ts">
import {ref} from "vue";
import {Form} from "vee-validate";
import VeeValidation from "@/components/forms/validation/VeeValidation.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";

const schema = defineProps(['schema'])

</script>

<template>
    {{schema.fields}}
      <UiParentCard>
        <Form>
          <v-row>
            <template v-for="field in schema.schema.fields">
                <v-col v-if="field.groupTitle" cols="12">
                  <h3 >{{field.groupTitle}}</h3>
                </v-col>

                <v-col cols="6">
                  <v-label class="text-wrap">{{field.label}}</v-label>

                    <v-text-field
                      type="number"
                      :rules="required"
                      hide-details="auto"
                      required
                      variant="outlined"
                      class="mt-2"
                      color="primary"
                      placeholder=""
                    ></v-text-field>
                </v-col>
              </template>
              </v-row>
        </Form>
      </UiParentCard>
</template>

<style scoped lang="scss">

</style>