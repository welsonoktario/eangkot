import { Angkot, Trayek, User } from '@/types'
import { LngLatLike } from 'mapbox-gl'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type PerjalananState = {
  _angkot: Angkot | undefined
  _trayek: Trayek | string | undefined
  _jemput: LngLatLike | undefined
  _tujuan: LngLatLike | undefined
  _isPerjalananStarted: boolean
}

export const usePerjalanan = defineStore('perjalanan', {
  state: () =>
    reactive<PerjalananState>({
      _angkot: undefined,
      _trayek: undefined,
      _jemput: undefined,
      _tujuan: undefined,
      _isPerjalananStarted: false,
    }),
  getters: {
    angkot: (state) => state._angkot,
    driver(): User {
      return this.angkot!.driver
    },
    trayek: (state) => state._trayek,
    jemput: (state) => state._jemput,
    tujuan: (state) => state._tujuan,
    isPerjalananStarted: (state) => state._isPerjalananStarted,
  },
  actions: {
    cariAngkot(trayek: Trayek, jemput: LngLatLike, tujuan: LngLatLike) {
      this._trayek = trayek
      this._jemput = jemput
      this._tujuan = tujuan
    },
    setAngkot(angkot: Angkot) {
      this._angkot = angkot
    },
  },
})
