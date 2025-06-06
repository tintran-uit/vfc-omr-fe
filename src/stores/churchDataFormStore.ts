import { defineStore } from 'pinia'
import churchFormDataApi from '@/apis/churchDataFormApi'

export const churchDataFormStore = defineStore('churchDataFormStore', {
    state: () => ({
        parents: [] as Array<{ id: string; name: string }>,
        languages: [] as Array<{ id: string; name: string }>,
        types: [] as Array<{ id: string; name: string }>,
        pastors: [] as Array<{ id: string; name: string }>,
        networks: [] as Array<{ id: string; name: string }>,
        regions: [] as Array<{ id: string; name: string }>,
        countries: [] as Array<{ id: string; name: string }>,
        currencies: [] as Array<{ id: string; name: string }>,


        types: [] as Array<{ id: string; name: string }>,

        parents: [] as Array<{ id: string; name: string }>,
        loaded: false,
        loading: false,
    }),
    getters: {
    },
    actions: {
        async fetchData() {
            // Nếu đã có dữ liệu → không load lại
            if (this.loaded) return

            if (this.loading) return;

            this.loading = true;

            const data = await churchFormDataApi.getData();

            this.parents = data.parents;
            this.languages = data.languages;
            this.types = data.types;
            this.pastors = data.pastor;
            this.networks = data.networks;
            this.regions = data.regions;
            this.countries = data.countries;
            this.currencies = data.currencies;

            this.loading = false;
            this.loaded = true;

        },
    },
})
