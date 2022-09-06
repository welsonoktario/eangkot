<template>
  <app-layout>
    <template #header>
      <app-bar title="Perjalanan">
        <template #start>
          <ion-back-button />
        </template>
      </app-bar>
    </template>

    <template #content>
      <ion-grid>
        <ion-row id="map-wrapper">
          <ion-col>
            <div
              id="map"
              :style="[
                isLoaded ? { visibility: 'visible' } : { visibility: 'hidden' },
              ]"
            ></div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-list class="ion-padding-horizontal" inset>
              <ion-item>
                <ion-label position="floating">Trayek</ion-label>
                <ion-input
                  v-model="destinasi.trayek"
                  clearInput
                  readonly
                  @click="openModalTrayek()"
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Lokasi Jemput</ion-label>
                <ion-input
                  v-model="destinasi.textJemput"
                  clearInput
                  readonly
                  @click="openModal('Pilih lokasi jemput', 'jemput')"
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Lokasi Tujuan</ion-label>
                <ion-input
                  v-model="destinasi.textTujuan"
                  clearInput
                  readonly
                  @click="openModal('Pilih lokasi tujuan', 'tujuan')"
                ></ion-input>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import ModalCariAlamat from '@/components/Perjalanan/ModalCariAlamat.vue'
import ModalPilihTrayek from '@/components/Perjalanan/ModalPilihTrayek.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { Trayek } from '@/types'
import { Geolocation } from '@capacitor/geolocation'
import {
  IonBackButton,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  modalController,
} from '@ionic/vue'
import buffer from '@turf/buffer'
import { Feature, LineString } from 'geojson'
import { GeolocateControl, LngLat, LngLatBounds, Map, Marker } from 'mapbox-gl'
import { onMounted, ref } from 'vue'

let map: Map
const accessToken =
  'pk.eyJ1Ijoid2Vsc29ub2t0YXJpbyIsImEiOiJja3liam9zNW0wZnppMnVvZGdwaW1tZDltIn0.VZSKrmUqnhui_Z4XQYrvYg'
const isLoaded = ref(false)
const isDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const destinasi = ref({
  trayek: '',
  jemput: [],
  markerJemput: undefined,
  textJemput: '',
  tujuan: [],
  markerTujuan: undefined,
  textTujuan: '',
} as {
  trayek: string
  jemput: number[]
  markerJemput: Marker | undefined
  textJemput: string
  tujuan: number[]
  markerTujuan: Marker | undefined
  textTujuan: string
})
const cariType = ref('jemput')

onMounted(async () => {
  map = new Map({
    container: 'map',
    style: isDark
      ? 'mapbox://styles/mapbox/dark-v10'
      : 'mapbox://styles/mapbox/light-v10', // style URL
    center: [112.7518702, -7.2621774], // starting position [lng, lat]
    zoom: 13, // starting zoom
    accessToken,
  })

  map.on('load', async () => {
    isLoaded.value = true
    map.resize()

    map.addSource('trayek', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })
    map.addSource('trayek-buffer', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })
    map.addLayer({
      id: 'trayek',
      type: 'line',
      source: 'trayek',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'red',
        'line-width': 1,
      },
    })
    map.addLayer({
      id: 'trayek-buffer',
      type: 'line',
      source: 'trayek-buffer',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'red',
        'line-width': 1,
      },
    })
  })

  map.addControl(new GeolocateControl())

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      event.matches
        ? map.setStyle('mapbox://styles/mapbox/dark-v10')
        : map.setStyle('mapbox://styles/mapbox/light-v10')
    })
})

const getRoute = async () => {
  const jemput = destinasi.value.jemput.join(',')
  const tujuan = destinasi.value.tujuan.join(',')

  await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${jemput};${tujuan}?geometries=geojson&access_token=${accessToken}`
  )
    .then((res) => res.json())
    .then((data) => {
      const routes = data.routes[0]
      const route = routes.geometry.coordinates
      const geojson: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      }

      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson,
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      })

      const bounds = new LngLatBounds(route[0], route[0])

      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of route) {
        bounds.extend(coord)
      }

      map.fitBounds(bounds, {
        padding: 20,
      })
    })
}

const openModal = async (title: string, type: string) => {
  cariType.value = type
  const modal = await modalController.create({
    component: ModalCariAlamat,
    componentProps: { title },
  })

  modal.present()

  const data = await (await modal.onDidDismiss()).data

  if (data) {
    if (data === 'current') {
      await getCurrentLocation()
      drawMarker()
      destinasi.value.textJemput = 'Lokasi saat ini'
    } else if (typeof data === 'object') {
      if (cariType.value == 'jemput') {
        destinasi.value.jemput = data.geometry.coordinates
        destinasi.value.textJemput = data.place_name
      } else {
        destinasi.value.tujuan = data.geometry.coordinates
        destinasi.value.textTujuan = data.place_name
      }
      drawMarker()
    }
  }
}

const openModalTrayek = async () => {
  const modal = await modalController.create({
    component: ModalPilihTrayek,
  })

  modal.present()

  const data = await (await modal.onDidDismiss()).data

  if (data) {
    destinasi.value.trayek = (data as Trayek).kode
    drawTrayekLines()
  }
}

const getCurrentLocation = async () => {
  const { coords } = await Geolocation.getCurrentPosition()

  destinasi.value.jemput = [coords.longitude, coords.latitude]
}

const drawMarker = () => {
  if (cariType.value == 'jemput') {
    destinasi.value.markerJemput = new Marker()
      .setLngLat(
        new LngLat(destinasi.value.jemput[0], destinasi.value.jemput[1])
      )
      .addTo(map)

    map.flyTo({
      center: destinasi.value.markerJemput.getLngLat(),
    })
  } else {
    destinasi.value.markerTujuan = new Marker()
      .setLngLat(
        new LngLat(destinasi.value.tujuan[0], destinasi.value.tujuan[1])
      )
      .addTo(map)

    map.flyTo({
      center: destinasi.value.markerTujuan.getLngLat(),
    })
  }

  if (destinasi.value.markerJemput && destinasi.value.markerTujuan) {
    getRoute()
  }
}

const drawTrayekLines = async () => {
  const rute = await import(`@/assets/rute-${destinasi.value.trayek}.json`)

  /* const buffered = rute.default.features.map((feature: LineString) => {
    buffer(feature, 25, { units: 'meters' })
  })

  console.log(buffered) */

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  map.getSource('trayek').setData(rute.default)
  const bounds = new LngLatBounds()

  rute.features[0].geometry.coordinates[0].forEach(function (feature) {
    bounds.extend(feature)
  })

  map.fitBounds(bounds, {
    padding: 32,
  })
}
</script>

<style scoped>
ion-content {
  --offset-bottom: auto !important;
  --overflow: auto;
  --background: #f7f7fa;
  overflow: auto;
}

ion-content::part(background) {
  bottom: 0;
}

ion-content::-webkit-scrollbar {
  display: none;
  scrollbar-width: none;
}

#map {
  width: 100%;
  height: 100%;
  visibility: hidden;
}

ion-grid {
  display: flex;
  flex-flow: column;
  height: 100%;
  padding: 0;
}

ion-col {
  padding: 0;
}

#map-wrapper {
  flex-grow: 1;
}
</style>
