import { Angkot, Trayek, User } from '@/types'
import { forHumans, rupiah } from '@/utils'
import { LngLatLike } from 'mapbox-gl'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type PerjalananState = {
  _angkot: Angkot | undefined
  _trayek: Trayek | undefined
  _jemput: LngLatLike | undefined
  _jemputStr: string
  _tujuan: LngLatLike | undefined
  _tujuanStr: string
  _isPerjalananStarted: boolean
  _durasi: number
  _ongkos: number
  _distance: number
}

export const usePerjalanan = defineStore('perjalanan', {
  persist: true,
  state: () =>
    reactive<PerjalananState>({
      _angkot: undefined,
      _trayek: undefined,
      _jemput: undefined,
      _jemputStr: '',
      _tujuan: undefined,
      _tujuanStr: '',
      _isPerjalananStarted: false,
      _durasi: 0,
      _ongkos: 0,
      _distance: 0,
    }),
  getters: {
    angkot: (state) => state._angkot,
    driver(): User {
      return this.angkot!.driver
    },
    trayek: (state) => state._trayek,
    jemput: (state) => state._jemput,
    jemputStr: (state) => state._jemputStr,
    tujuan: (state) => state._tujuan,
    tujuanStr: (state) => state._tujuanStr,
    isPerjalananStarted: (state) => state._isPerjalananStarted,
    durasi: (state) => state._durasi,
    ongkos: (state) => state._ongkos,
    durasiStr: (state) => forHumans(state._durasi),
    ongkosStr: (state) => rupiah(state._ongkos),
    distance: (state) => state._distance,
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
    setPerjalananDetail(durasi: number, distance: number, ongkos: number) {
      this._durasi = durasi
      this._distance = distance
      this._ongkos = ongkos
    },
  },
})
