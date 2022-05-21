<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Perjalanan</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
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
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonBackButton,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  modalController,
} from "@ionic/vue";
import { onMounted, reactive, ref } from "vue";
import ModalCariAlamat from "@/components/perjalanan/ModalCariAlamat.vue";
import { GeolocateControl, Map, Marker, LngLat, LngLatBounds } from "mapbox-gl";
import { Geolocation } from "@capacitor/geolocation";
import { Feature, LineString } from "geojson";

let map: Map;
const accessToken =
  "pk.eyJ1Ijoid2Vsc29ub2t0YXJpbyIsImEiOiJja3liam9zNW0wZnppMnVvZGdwaW1tZDltIn0.VZSKrmUqnhui_Z4XQYrvYg";
const isLoaded = ref(false);
const isDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
const destinasi = reactive({
  jemput: [],
  markerJemput: undefined,
  textJemput: "",
  tujuan: [],
  markerTujuan: undefined,
  textTujuan: "",
} as {
  jemput: number[];
  markerJemput: Marker | undefined;
  textJemput: string;
  tujuan: number[];
  markerTujuan: Marker | undefined;
  textTujuan: string;
});
const cariType = ref("jemput");

onMounted(async () => {
  map = new Map({
    container: "map",
    style: isDark
      ? "mapbox://styles/mapbox/dark-v10"
      : "mapbox://styles/mapbox/light-v10", // style URL
    center: [112.7518702, -7.2621774], // starting position [lng, lat]
    zoom: 13, // starting zoom
    accessToken,
  });

  map.on("load", async () => {
    isLoaded.value = true;
    map.resize();
  });

  map.addControl(new GeolocateControl());

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      event.matches
        ? map.setStyle("mapbox://styles/mapbox/dark-v10")
        : map.setStyle("mapbox://styles/mapbox/light-v10");
    });
});

const getRoute = async () => {
  const jemput = destinasi.jemput.join(",");
  const tujuan = destinasi.tujuan.join(",");

  await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${jemput};${tujuan}?geometries=geojson&access_token=${accessToken}`
  )
    .then((res) => res.json())
    .then((data) => {
      const routes = data.routes[0];
      const route = routes.geometry.coordinates;
      const geojson: Feature<LineString> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      };

      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: geojson,
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });

      const bounds = new LngLatBounds(route[0], route[0]);

      // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
      for (const coord of route) {
        bounds.extend(coord);
      }

      map.fitBounds(bounds, {
        padding: 20,
      });
    });
};

const openModal = async (title: string, type: string) => {
  cariType.value = type;
  const modal = await modalController.create({
    component: ModalCariAlamat,
    componentProps: { title },
  });

  modal.present();

  const data = await (await modal.onDidDismiss()).data;

  if (data) {
    if (data === "current") {
      await getCurrentLocation();
      drawMarker();
      destinasi.textJemput = "Lokasi saat ini";
    } else if (typeof data === "object") {
      if (cariType.value == "jemput") {
        destinasi.jemput = data.geometry.coordinates;
        destinasi.textJemput = data.place_name;
      } else {
        destinasi.tujuan = data.geometry.coordinates;
        destinasi.textTujuan = data.place_name;
      }
      drawMarker();
    }
  }
};

const getCurrentLocation = async () => {
  const { coords } = await Geolocation.getCurrentPosition();

  destinasi.jemput = [coords.longitude, coords.latitude];
};

const drawMarker = () => {
  if (cariType.value == "jemput") {
    destinasi.markerJemput = new Marker()
      .setLngLat(new LngLat(destinasi.jemput[0], destinasi.jemput[1]))
      .addTo(map);

    map.flyTo({
      center: destinasi.markerJemput.getLngLat(),
    });
  } else {
    destinasi.markerTujuan = new Marker()
      .setLngLat(new LngLat(destinasi.tujuan[0], destinasi.tujuan[1]))
      .addTo(map);

    map.flyTo({
      center: destinasi.markerTujuan.getLngLat(),
    });
  }

  if (destinasi.markerJemput && destinasi.markerTujuan) {
    getRoute();
  }
};
</script>

<style>
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
