import { Pesanan } from '@/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type PesananState = {
  _pesanans: Pesanan[]
}

export const usePesanan = defineStore('pesanan', {
  state: () =>
    reactive<PesananState>({
      _pesanans: [],
    }),
  getters: {
    pesanans: (state) => state._pesanans,
  },
  actions: {
    setPesanans(pesanans: Pesanan[]) {
      this._pesanans = pesanans
    },
  },
})
