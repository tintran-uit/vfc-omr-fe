<script setup lang="ts">
console.log('API URL:', import.meta.env.VITE_API_URL);
import userApi from '@/apis/userApi';

const getUser = async () => {
  const data = await userApi.getUser(2);

  console.log(data);
}



</script>

<template>
  <v-container>
    <v-btn @click="getUser">Get user</v-btn>
    <v-row
        align="start"
        style="height: 150px;"
        no-gutters
    >
      <v-col cols="6" sm="3" lg="3" v-for="n in 6"
             :key="n">
        <v-text-field label="firstName" />
      </v-col>

    </v-row>
  </v-container>
</template>

<style scoped lang="scss">

</style>