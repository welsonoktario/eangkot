import { Transaksi, Ulasan } from '@/types'
import { get, patch } from '@/utils/http'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useRiwayat = defineStore('riwayat', {
  state: () =>
    reactive({
      _transaksis: [] as Transaksi[],
    }),
  getters: {
    transaksis: (state) => state._transaksis,
  },
  actions: {
    setTransaksis(transaksis: Transaksi[]) {
      this._transaksis = transaksis
    },
    updateTransaksi(id: number, transaksi: Transaksi) {
      const index = this._transaksis.findIndex((t: Transaksi) => t.id === id)
      this._transaksis[index].ulasan = transaksi.ulasan
    },
    findTransaksi(id: number) {
      return this._transaksis.find((p: Transaksi) => p.id === id)
    },
    loadRiwayat() {
      const error = ref<any | null>(null)
      const loading = ref<boolean>(true)

      get('transaksi')
        .then((res) => (this._transaksis = res.data.data))
        .catch((err) => (error.value = err))
        .finally(() => (loading.value = false))

      return { error, loading }
    },
    async addUlasan(id: number, ulasan: Ulasan) {
      return await patch(`transaksi/${id}`, ulasan)
    },
  },
})
