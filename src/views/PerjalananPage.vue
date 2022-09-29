<template>
  <app-layout transparent>
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
        <ion-row v-if="!isPerjalananStarted">
          <ion-col>
            <ion-list class="ion-padding-horizontal" inset>
              <ion-item button detail>
                <ion-label position="floating">Pilih trayek</ion-label>
                <ion-input
                  v-model="destinasi.trayek"
                  readonly
                  @click="openModalTrayek()"
                ></ion-input>
              </ion-item>
              <ion-item button detail v-if="destinasi.trayek">
                <ion-label position="floating">Lokasi Jemput</ion-label>
                <ion-input
                  v-model="destinasi.textJemput"
                  readonly
                  @click="openModal('Pilih lokasi jemput', 'jemput')"
                ></ion-input>
              </ion-item>
              <ion-item button detail v-if="destinasi.trayek">
                <ion-label position="floating">Lokasi Tujuan</ion-label>
                <ion-input
                  v-model="destinasi.textTujuan"
                  readonly
                  @click="openModal('Pilih lokasi tujuan', 'tujuan')"
                ></ion-input>
              </ion-item>
              <e-a-button
                v-if="destinasi.trayek"
                @click="cariAngkot()"
                class="ion-margin-top"
                expand="block"
                >Cari Angkot</e-a-button
              >
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import EAButton from '@/components/EAButton.vue'
import ModalCariAlamat from '@/components/Perjalanan/ModalCariAlamat.vue'
import ModalMencari from '@/components/Perjalanan/ModalMencari.vue'
import ModalPilihTrayek from '@/components/Perjalanan/ModalPilihTrayek.vue'
import { useCurrentLocation } from '@/composables'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAngkot } from '@/stores'
import { Trayek } from '@/types'
import { Angkot } from '@/types/angkot'
import { Dialog } from '@capacitor/dialog'
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
import { MultiLineString } from '@turf/helpers'
import { collection, Firestore, onSnapshot } from 'firebase/firestore'
import { LineString } from 'geojson'
import {
  GeolocateControl,
  LngLat,
  LngLatBounds,
  LngLatLike,
  Map,
  Marker,
} from 'mapbox-gl'
import { inject, onMounted, ref } from 'vue'

type DestinasiType = {
  trayek: string
  jemput: number[]
  markerJemput: Marker | undefined
  textJemput: string
  tujuan: number[]
  markerTujuan: Marker | undefined
  textTujuan: string
}

const db: Firestore = inject('db')
const coords = useCurrentLocation()
const angkot = useAngkot()

let map: Map
const accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN
const isLoaded = ref(false)
const isDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const destinasi = ref<DestinasiType>({
  trayek: '',
  jemput: [],
  markerJemput: undefined,
  textJemput: '',
  tujuan: [],
  markerTujuan: undefined,
  textTujuan: '',
})
const cariType = ref('jemput')
const isPerjalananStarted = ref(false)

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
    map.addSource('route', {
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
        'line-color': '#36817b',
        'line-width': 2,
      },
    })
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#000',
        'line-width': 2,
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
      const route = data.routes[0]
      const ls: LineString = route.geometry

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      map.getSource('route').setData(ls)

      const bounds = new LngLatBounds(ls[0], ls[0])

      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of ls.coordinates) {
        bounds.extend(coord as LngLatLike)
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
    loadAngkots()
  }
}

const getCurrentLocation = () => {
  destinasi.value.jemput = [coords.value.longitude, coords.value.latitude]
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

  const buffered = buffer(rute.geometry as MultiLineString, 75, {
    units: 'meters',
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  map.getSource('trayek').setData(buffered)
  const bounds = new LngLatBounds()

  rute.geometry.coordinates[0].forEach(function (feature) {
    bounds.extend(feature)
  })

  map.fitBounds(bounds, {
    padding: 32,
  })
}

const cariAngkot = async () => {
  const modal = await modalController.create({
    component: ModalMencari,
  })

  await modal.present()

  const { data } = await modal.onDidDismiss()

  data
    ? startPerjalanan()
    : await Dialog.alert({
        message:
          'Maaf, untuk sementara tidak ada angkot tersedia. Silahkan coba lagi nanti',
      })
}

const startPerjalanan = async () => {
  isPerjalananStarted.value = true
  setTimeout(() => map.resize(), 100)
}

const loadAngkots = async () => {
  const trayek = destinasi.value.trayek
  const docsRef = collection(db, `angkots-${trayek}`)

  onSnapshot(docsRef, (snap) => {
    const angkots = snap.docs.map((doc) => {
      const angkot = doc.data()
      angkot.lokasi = [angkot.lokasi.longitude, angkot.lokasi.latitude]

      return angkot
    }) as Angkot[]

    angkot.setAngkots(angkots)
    drawAngkots()
  })
}

const drawAngkots = () => {
  angkot.angkots.forEach((angkot) => {
    new Marker().setLngLat(angkot.lokasi).addTo(map)
  })
}
</script>

<style scoped>
ion-item {
  align-items: center !important;
}

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
