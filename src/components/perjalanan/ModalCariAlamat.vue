<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="closeModal(null)">
          <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="closeModal('pilih')">
          <ion-icon slot="icon-only" :icon="mapOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
    <ion-toolbar>
      <ion-searchbar :debounce="500" v-model="query"></ion-searchbar>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-item
        v-if="isJemput"
        detail
        button
        @click="closeModal('current')"
        lines="inset"
      >
        <ion-label>Gunakan lokasi saat ini</ion-label>
      </ion-item>
      <ion-item
        v-for="item in results"
        detail
        button
        @click="closeModal(item)"
        :key="item.id"
      >
        <ion-label>{{ item.place_name }}</ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  modalController,
} from "@ionic/vue";
import { arrowBack, mapOutline } from "ionicons/icons";

const props = defineProps({
  title: { type: String, default: "Cari Alamat" },
});

const query = ref("");
const results = ref([]);

watch(query, async () => cariAlamat());

const isJemput = computed(() => props.title.includes("jemput"));

const closeModal = (data: any) => modalController.dismiss(data);

const cariAlamat = async () => {
  const q = encodeURI(query.value);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json?country=ID&region=ID-JI&access_token=pk.eyJ1Ijoid2Vsc29ub2t0YXJpbyIsImEiOiJja3liam9zNW0wZnppMnVvZGdwaW1tZDltIn0.VZSKrmUqnhui_Z4XQYrvYg`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      results.value = data.features;
    });
};
</script>

<style scoped>
ion-toolbar.md {
  --ion-background-color: #121212;
}
</style>
