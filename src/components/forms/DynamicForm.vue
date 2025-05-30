<script setup lang="ts">
import {ref, defineEmits, reactive} from "vue";
import {Form} from "vee-validate";
import VeeValidation from "@/components/forms/validation/VeeValidation.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import {useDeepModel} from '@/utils/objectUtil.js';
import TextInput from "../input/TextInput.vue";

const emit = defineEmits(['submit']);

const { schema, data } = defineProps(['schema', 'data'])

const form = reactive(data);

const onSubmit = function () {
  emit('submit', form);
}
</script>

<template>
      <UiParentCard>
        <form @submit.prevent="onSubmit">
          <v-row>
            <template v-for="field in schema.fields">
                <v-col v-if="field.groupTitle" cols="12">
                  <h3 >{{field.groupTitle}}</h3>
                </v-col>

                <v-col cols="6">
                  <TextInput
                    :form="form"
                    :field="field"
                    />
                </v-col>
              </template>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn color="primary" block class="mt-4" variant="flat" type="submit">Save</v-btn>
                </v-col>
              </v-row>
        </Form>
      </UiParentCard>
</template>

<style scoped lang="scss">

</style>