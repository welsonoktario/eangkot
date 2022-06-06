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
    <ion-toolbar v-if="isPlatform('ios')" class="searchbar">
      <ion-searchbar
        ref="searchBar"
        debounce="500"
        v-model="query"
      ></ion-searchbar>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-toolbar v-if="isPlatform('android')" class="searchbar">
      <ion-searchbar
        ref="searchBar"
        debounce="500"
        v-model="query"
      ></ion-searchbar>
    </ion-toolbar>
    <ion-list>
      <ion-item v-if="isJemput" detail button @click="closeModal('current')">
        <ion-label>Gunakan lokasi saat ini</ion-label>
      </ion-item>
      <DynamicScroller
        v-if="results.length"
        :items="results"
        :min-item-size="results.length"
        class="scroller"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[item.place_name]"
            :data-index="index"
          >
            <ion-item detail button @click="closeModal(item)">
              <ion-label>{{ item.place_name }}</ion-label>
            </ion-item>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </ion-list>
  </ion-content>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
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
  isPlatform,
} from "@ionic/vue";
import { arrowBack, mapOutline } from "ionicons/icons";
import { get } from "@/utils/http";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const props = defineProps({
  title: { type: String, default: "Cari Alamat" },
});

const searchBar = ref(null);
const query = ref("");
const results = ref([]);

onMounted(() => {
  nextTick(() => {
    setTimeout(async () => await searchBar.value.ionFocus, 150);
  });
});

watch(query, async () => cariAlamat());

const isJemput = computed(() => props.title.includes("jemput"));

const closeModal = (data: any) => modalController.dismiss(data);

const cariAlamat = async () => {
  const q = encodeURI(query.value);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json?country=ID&region=ID-JI&access_token=pk.eyJ1Ijoid2Vsc29ub2t0YXJpbyIsImEiOiJja3liam9zNW0wZnppMnVvZGdwaW1tZDltIn0.VZSKrmUqnhui_Z4XQYrvYg`;

  const res = await get(url);
  const data = await res.data;
  results.value = JSON.parse(data).features;
};
</script>

<style scoped>
.scroller {
  height: 100%;
}

.md .searchbar {
  padding-top: 2px;
  --ion-background-color: transparent !important;
}

.ios .searchbar {
  padding-top: 8px;
}

.ios .searchbar ion-searchbar {
  padding: 0;
}
</style>
