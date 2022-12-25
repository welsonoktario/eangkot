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
        <ion-row v-if="!perjalanan.isPerjalananStarted">
          <ion-col>
            <ion-list class="ion-padding-horizontal" inset>
              <ion-item button detail>
                <ion-label position="floating">Pilih trayek</ion-label>
                <ion-input
                  v-model="destinasi.kode"
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
              <ion-item v-if="estimasiDurasi">
                <ion-label position="floating">Estimasi Durasi</ion-label>
                <ion-input :value="estimasiDurasi" readonly></ion-input>
              </ion-item>
              <ion-item v-if="estimasiOngkos">
                <ion-label position="floating">Estimasi Ongkos</ion-label>
                <ion-input :value="estimasiOngkos" readonly></ion-input>
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
        <card-angkot
          v-else-if="perjalanan.isPerjalananStarted && perjalanan.angkot"
          :angkot="perjalanan.angkot"
        />
      </ion-grid>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import EAButton from '@/components/EAButton.vue'
import CardAngkot from '@/components/Perjalanan/CardAngkot.vue'
import ModalCariAlamat from '@/components/Perjalanan/ModalCariAlamat.vue'
import ModalMencari from '@/components/Perjalanan/ModalMencari.vue'
import ModalPilihTrayek from '@/components/Perjalanan/ModalPilihTrayek.vue'
import ModalRating from '@/components/Riwayat/ModalRating.vue'
import { useCurrentLocation } from '@/composables'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAngkot, useAuth, usePerjalanan, useRiwayat } from '@/stores'
import { AddTransaksi, Angkot, Trayek } from '@/types'
import { StatusPesanan } from '@/types/statusEnum'
import {
  calculateOngkos,
  forHumans,
  rupiah,
  showDialog,
  showToast,
} from '@/utils'
import { Geolocation } from '@capacitor/geolocation'
import {
  collection,
  doc,
  Firestore,
  limit,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from '@firebase/firestore'
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
  useIonRouter,
} from '@ionic/vue'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import buffer from '@turf/buffer'
import { LineString, MultiLineString, point } from '@turf/helpers'
import {
  GeolocateControl,
  LngLat,
  LngLatBounds,
  LngLatLike,
  Map,
  Marker,
} from 'mapbox-gl'
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'

type DestinasiType = {
  trayek: Trayek | undefined
  kode: string
  jemput: [number, number] | undefined
  tujuan: [number, number] | undefined
  markerJemput: Marker | undefined
  markerTujuan: Marker | undefined
  textJemput: string
  textTujuan: string
}

const db: Firestore = inject('db')
const coords = useCurrentLocation()
const auth = useAuth()
const angkot = useAngkot()
const perjalanan = usePerjalanan()
const riwayat = useRiwayat()
const router = useIonRouter()

let map: Map
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const isLoaded = ref(false)
const isDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const destinasi = ref<DestinasiType>({
  trayek: undefined,
  kode: '',
  jemput: undefined,
  tujuan: undefined,
  markerJemput: undefined,
  markerTujuan: undefined,
  textJemput: '',
  textTujuan: '',
})
const estimasiRoute = ref<any>()
const cariType = ref('jemput')
const angkotUnsubscribe = ref<Unsubscribe>()
const perjalananUnsubscribe = ref<Unsubscribe>()
const jemputUnsubscriber = ref<Unsubscribe>()
const locationWatcher = ref<string>()

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
    .addEventListener('change', (event) =>
      event.matches
        ? map.setStyle('mapbox://styles/mapbox/dark-v10')
        : map.setStyle('mapbox://styles/mapbox/light-v10')
    )

  if (perjalanan.angkot) {
    await loadPesanan(perjalanan.trayek.kode, perjalanan.angkot.docId)
  }
})

const estimasiOngkos = computed(() =>
  !estimasiRoute.value
    ? null
    : rupiah(calculateOngkos(estimasiRoute.value?.distance))
)
const estimasiDurasi = computed(() =>
  !estimasiRoute.value ? null : forHumans(estimasiRoute.value?.duration)
)

const getRoute = () => {
  const jemput = destinasi.value.jemput.join(',')
  const tujuan = destinasi.value.tujuan.join(',')

  fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${jemput};${tujuan}?geometries=geojson&access_token=${accessToken}`
  )
    .then((res) => res.json())
    .then((data) => {
      const route = data.routes[0]
      estimasiRoute.value = route
      perjalanan.setDurasiDanOngkos(
        route.duration,
        calculateOngkos(route.distance)
      )
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

const fetchAddres = async (lngLat: LngLatLike) => {
  try {
    const latLng = (lngLat as number[]).slice().reverse().join(',')
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=${apiKey}`
    )
    return await res.json()
  } catch (e: any) {
    await showToast('Terjadi kesalahan memuat alamat', 'danger')
  }
}

const openModal = async (title: string, type: string) => {
  cariType.value = type
  const modal = await modalController.create({
    component: ModalCariAlamat,
    componentProps: { title },
  })

  await modal.present()

  const data = await (await modal.onDidDismiss()).data

  if (data) {
    if (data === 'current') {
      getCurrentLocation()
      drawMarker()
      destinasi.value.textJemput = 'Lokasi saat ini'
      fetchAddres(destinasi.value.jemput).then(
        (res) => (perjalanan._jemputStr = res.results[0].formatted_address)
      )
    } else if (typeof data === 'object') {
      if (cariType.value == 'jemput') {
        destinasi.value.jemput = [
          data.geometry.location.lng,
          data.geometry.location.lat,
        ]
        destinasi.value.textJemput = data.formatted_address
        perjalanan._jemputStr = data.formatted_address
      } else {
        destinasi.value.tujuan = [
          data.geometry.location.lng,
          data.geometry.location.lat,
        ]
        destinasi.value.textTujuan = data.formatted_address
        perjalanan._tujuanStr = data.formatted_address
      }

      const inRute = checkPointInPolygon([
        data.geometry.location.lng,
        data.geometry.location.lat,
      ])

      if (inRute) {
        drawMarker()
      }
    }
  }
}

const checkPointInPolygon = (pt: number[]) => {
  let inPolygon: boolean = true

  const trayekSource = map.querySourceFeatures('trayek')

  trayekSource.forEach((source) => {
    inPolygon = booleanPointInPolygon(point(pt), source.geometry as any)

    if (inPolygon) return
  })

  return inPolygon
}

const openModalTrayek = async () => {
  const modal = await modalController.create({
    component: ModalPilihTrayek,
  })

  await modal.present()

  const data: Trayek = await (await modal.onDidDismiss()).data

  if (data) {
    destinasi.value.kode = data.kode
    destinasi.value.trayek = data
    drawTrayekLines()
    loadAngkots()
  }
}

const getCurrentLocation = () => {
  destinasi.value.jemput = [coords.value.longitude, coords.value.latitude]
}

const drawMarker = () => {
  if (cariType.value == 'jemput') {
    if (!destinasi.value.markerJemput) {
      destinasi.value.markerJemput = new Marker()
        .setLngLat(
          new LngLat(destinasi.value.jemput[0], destinasi.value.jemput[1])
        )
        .addTo(map)
    } else {
      destinasi.value.markerJemput.setLngLat(
        new LngLat(destinasi.value.jemput[0], destinasi.value.jemput[1])
      )
    }

    map.flyTo({
      center: destinasi.value.markerJemput.getLngLat(),
    })
  } else {
    if (!destinasi.value.markerTujuan) {
      destinasi.value.markerTujuan = new Marker()
        .setLngLat(
          new LngLat(destinasi.value.tujuan[0], destinasi.value.tujuan[1])
        )
        .addTo(map)
    } else {
      destinasi.value.markerTujuan.setLngLat(
        new LngLat(destinasi.value.tujuan[0], destinasi.value.tujuan[1])
      )
    }

    map.flyTo({
      center: destinasi.value.markerTujuan.getLngLat(),
    })
  }

  if (destinasi.value.markerJemput && destinasi.value.markerTujuan) {
    getRoute()
  }
}

const drawTrayekLines = async () => {
  const rute = await import(`@/assets/rute-${destinasi.value.kode}.json`)

  const buffered = buffer(rute.geometry as MultiLineString, 25, {
    units: 'meters',
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  map.getSource('trayek').setData(buffered)
  const bounds = new LngLatBounds()

  rute.geometry.coordinates.forEach((feature: any) => {
    feature.forEach((f: any) => {
      bounds.extend(f)
    })
  })

  map.fitBounds(bounds, {
    padding: 32,
  })
}

const cariAngkot = async () => {
  perjalanan.cariAngkot(
    destinasi.value.trayek,
    destinasi.value.jemput,
    destinasi.value.tujuan
  )
  const modal = await modalController.create({
    component: ModalMencari,
  })

  await modal.present()

  const { data } = await modal.onDidDismiss()

  data
    ? setTimeout(() => {
        map.resize()
        loadPesanan(perjalanan.trayek.kode, perjalanan.angkot.docId)
      }, 100)
    : await showDialog({
        message:
          'Tidak ada angkot tersedia untuk saat ini. Silahkan coba lagi nanti',
      })
}

const loadAngkots = async () => {
  const kode = destinasi.value.kode
  const docsRef = collection(db, `angkots-${kode}`)

  angkotUnsubscribe.value = onSnapshot(docsRef, (snap) => {
    const angkots = snap.docs.map((doc) => {
      const angkot = doc.data()
      angkot.lokasi = [angkot.lokasi.longitude, angkot.lokasi.latitude]
      angkot.docId = doc.id

      return angkot
    }) as Angkot[]

    angkot.setAngkots(angkots)
    drawAngkots()
  })
}

const drawAngkots = () => {
  angkot.markers.forEach((marker) => marker.addTo(map))
}

const loadPesanan = async (trayek: string, docID: string) => {
  try {
    if (map.getLayer('trayek')) {
      map.removeLayer('trayek')
    }

    if (angkotUnsubscribe.value) {
      angkotUnsubscribe.value()
      angkot.removeMarkers()
    }

    const q = query(
      collection(db, `angkots-${trayek}/${docID}/penumpangs`),
      where('user.id', '==', auth.authUser.id),
      limit(1)
    )
    const unsub = onSnapshot(q, async (docs) => {
      const data = docs.docs[0].data()

      if (data.status == StatusPesanan.ACCEPT) {
        await pesananDiterima()
      } else if (data.status == StatusPesanan.PROCESS) {
        await pesananDiproses(data)
      } else if (data.status == StatusPesanan.DONE) {
        await Geolocation.clearWatch({ id: locationWatcher.value })
        jemputUnsubscriber.value && jemputUnsubscriber.value()
        perjalanan.$reset()
        unsub()
        alert('done')
      }
    })
  } catch (e: any) {
    await showToast('Terjadi kesalahan memuat detail pesanan', 'danger')
  }
}

const pesananDiterima = async () => {
  const docRef = doc(
    db,
    `angkots-${perjalanan.trayek.kode}/${perjalanan.angkot.docId}`
  )

  if (!jemputUnsubscriber.value) {
    jemputUnsubscriber.value = onSnapshot(docRef, async (doc) => {
      const angkot = doc.data()

      if (!destinasi.value.markerJemput) {
        destinasi.value.markerJemput = new Marker()
          .setLngLat([angkot.lokasi.longitude, angkot.lokasi.latitude])
          .addTo(map)
      } else {
        destinasi.value.markerJemput.setLngLat([
          angkot.lokasi.longitude,
          angkot.lokasi.latitude,
        ])
      }

      if (!destinasi.value.markerTujuan) {
        destinasi.value.markerTujuan = new Marker()
          .setLngLat(perjalanan.jemput)
          .addTo(map)
      }

      fetchRoute(destinasi.value.markerJemput, destinasi.value.markerTujuan)
    })
  }
}

const pesananDiproses = async (data: any) => {
  if (jemputUnsubscriber.value) {
    jemputUnsubscriber.value()
  }

  if (!destinasi.value.markerTujuan) {
    destinasi.value.markerTujuan = new Marker()
      .setLngLat([data.tujuan.longitude, data.tujuan.latitude])
      .addTo(map)
  } else {
    destinasi.value.markerTujuan.setLngLat([
      data.tujuan.longitude,
      data.tujuan.latitude,
    ])
  }

  if (!destinasi.value.markerJemput) {
    destinasi.value.markerJemput = new Marker()
      .setLngLat(perjalanan.jemput)
      .addTo(map)
  }

  if (!locationWatcher.value) {
    locationWatcher.value = await Geolocation.watchPosition(
      { enableHighAccuracy: true, timeout: 5000 },
      async (pos) => {
        const coords = pos.coords
        destinasi.value.markerJemput.setLngLat([
          coords.longitude,
          coords.latitude,
        ])

        fetchRoute(destinasi.value.markerJemput, destinasi.value.markerTujuan)
      }
    )
  }
}

const fetchRoute = async (jemput: Marker, tujuan: Marker) => {
  const jemputStr = jemput.getLngLat().toArray().join(',')
  const tujuanStr = tujuan.getLngLat().toArray().join(',')

  const res = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${jemputStr};${tujuanStr}?geometries=geojson&access_token=${accessToken}`
  )
  const json = await res.json()
  const route = json.routes[0]
  const ls: LineString = route.geometry

  setOrUpdateLayer(ls)
}

const setOrUpdateLayer = (geom: any) => {
  if (!map.getSource('perjalanan')) {
    map.addSource('perjalanan', {
      type: 'geojson',
      data: geom,
    })
    map.addLayer({
      id: 'perjalanan',
      type: 'line',
      source: 'perjalanan',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#000',
        'line-width': 2,
      },
    })
  } else {
    // @ts-ignore
    map.getSource('perjalanan').setData(geom)
  }

  const bounds = new LngLatBounds(geom[0], geom[0])

  // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
  for (const coord of geom.coordinates) {
    bounds.extend(coord as LngLatLike)
  }

  map.fitBounds(bounds, {
    padding: 20,
  })
}

const addTransaksi = async () => {
  try {
    const data: AddTransaksi = {
      user: auth.authUser.id,
      driver: perjalanan.angkot.driver.id,
      durasiPerjalanan: 0,
      jarakPerjalanan: 0,
      ongkos: 0,
      lokasiJemput: 'abc',
      lokasiTujuan: 'cba',
    }
    const res = await riwayat.addTransaksi(data)
  } catch (e: any) {
    await showToast('Terjadi kesalahan menambah transaksi', 'danger')
  }
}

const openModalRating = async (id: number) => {
  const modal = await modalController.create({
    component: ModalRating,
    componentProps: { id },
  })

  modal.present()
  router.back()
}

onUnmounted(() => {
  angkotUnsubscribe.value && angkotUnsubscribe.value()
  perjalananUnsubscribe.value && perjalananUnsubscribe.value()
})
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
