import { Angkot } from '@/types'
import { LngLatLike, Marker } from 'mapbox-gl'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

// https://stackoverflow.com/a/18883819
const calcCrow = (coord1: LngLatLike, coord2: LngLatLike) => {
  const R = 6371 // km
  const dLat = toRad(coord2[1] - coord1[1])
  const dLon = toRad(coord2[0] - coord1[0])
  const lat1 = toRad(coord1[1])
  const lat2 = toRad(coord2[1])

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c

  return d
}

const toRad = (value: number) => (value * Math.PI) / 180

const markerAngkotEl = document.createElement('div')
markerAngkotEl.className = 'marker-angkot'

export const useAngkot = defineStore('angkot', {
  state: () =>
    reactive({
      _angkots: [] as Angkot[],
      _markers: [] as Marker[],
    }),
  getters: {
    angkots: (state) => state._angkots,
    markers: (state) => state._markers,
  },
  actions: {
    setAngkots(angkots: Angkot[]) {
      this._angkots = angkots

      if (this._markers.length) {
        this._markers.forEach((marker: Marker) => {
          marker.remove()
        })
      }

      while (this._markers.length) {
        this._markers.pop()
      }

      this._angkots.forEach((angkot: Angkot) => {
        const marker = new Marker(markerAngkotEl).setLngLat(angkot.lokasi)
        this._markers.push(marker)
      })
    },
    findAngkots(jemput: LngLatLike, blacklist: string[] = []): Angkot[] {
      return this._angkots
        .filter((angkot: Angkot) => !blacklist.includes(angkot.docId))
        .sort((a: Angkot, b: Angkot) => {
          const distA = calcCrow(jemput, a.lokasi)
          const distB = calcCrow(jemput, b.lokasi)

          if (distA < distB) {
            return -1
          }
          if (distA > distB) {
            return 1
          }
          return 0
        })
    },
    removeMarkers() {
      if (this._markers.length) {
        this._markers.forEach((marker: Marker) => {
          marker.remove()
        })
      }
    },
  },
})
