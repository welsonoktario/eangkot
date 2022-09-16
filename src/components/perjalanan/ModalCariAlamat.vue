<template>
  <modal-layout
    @start-click="closeModal(null)"
    @end-click="closeModal('pilih')"
    :title="title"
  >
    <template #content>
      <ion-toolbar class="searchbar">
        <ion-searchbar ref="searchBar" :debounce="500" v-model="query" />
      </ion-toolbar>

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
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import {
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonToolbar,
  modalController,
} from '@ionic/vue'
import { computed, ref, watch } from 'vue'
import ModalLayout from '../ModalLayout.vue'

const props = defineProps({
  title: { type: String, default: 'Cari Alamat' },
})

const searchBar = ref(null)
const query = ref('')
const results = ref([])

watch(query, async () => cariAlamat())

const isJemput = computed(() => props.title.includes('jemput'))

const closeModal = (data: any) => modalController.dismiss(data)

const cariAlamat = async () => {
  const q = encodeURI(query.value)
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${q}.json?country=ID&region=ID-JI&access_token=pk.eyJ1Ijoid2Vsc29ub2t0YXJpbyIsImEiOiJja3liam9zNW0wZnppMnVvZGdwaW1tZDltIn0.VZSKrmUqnhui_Z4XQYrvYg`

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      results.value = data.features
    })
}
</script>

<style lang="scss" scoped>
.searchbar {
  --ion-background-color: #fff !important;
}

@media (prefers-color-scheme: dark) {
  .searchbar {
    --ion-background-color: #212121 !important;
  }

  ion-toolbar {
    --background: #121212;
  }
}

ion-searchbar {
  padding: 0 !important;
  margin-top: -16px;
}
</style>
