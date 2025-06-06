import { defineStore } from 'pinia'
import * as apiClient from '@/apis/apiClient'
import globalDataApi from '@/apis/globalDataApi'

export const globalDataStore = defineStore('globalDataStore', {
    state: () => ({
        _countries: [] as Array<{ id: string; name: string }>,
        currencies: [] as Array<{ id: string; name: string }>,
        regions: [] as Array<{ id: string; name: string }>,
        networks: [] as Array<{ id: string; name: string }>,
        pastors: [] as Array<{ id: string; name: string }>,
        types: [] as Array<{ id: string; name: string }>,
        languages: [] as Array<{ id: string; name: string }>,
        parents: [] as Array<{ id: string; name: string }>,
        loaded: false,
        loadingPromise: null as Promise<void> | null, // <- promise lock
    }),
    getters: {
    },
    actions: {
        async fetchGlobalData() {
            // Nếu đã có dữ liệu → không load lại
            if (this.loaded) return

            // Nếu đang load → chờ promise
            if (this.loadingPromise) {
                await this.loadingPromise
                return
            }

            // Nếu chưa load và chưa có promise → tạo mới
            this.loadingPromise = globalDataApi.getGlobalData()
                .then((res) => {
                    this.countries = res.data
                    this.loaded = true
                })
                .catch((e) => {
                    console.error('Failed to load countries:', e)
                })
                .finally(() => {
                    this.loadingPromise = null
                })

            await this.loadingPromise
        },
    },
})
