<template>
  <modal-layout title="Pilih Trayek" @start-click="closeModal(null)">
    <template #content>
      <ion-toolbar class="searchbar">
        <ion-searchbar :debounce="500" v-model="query" />
      </ion-toolbar>

      <ion-list v-if="data">
        <ion-item
          v-for="trayek in filterResults"
          @click="closeModal(trayek)"
          :key="trayek.id"
          detail
          button
        >
          <ion-label>{{ trayek.kode }}</ion-label>
        </ion-item>
      </ion-list>

      <div v-if="loading" class="spin">
        <ion-spinner></ion-spinner>
      </div>

      <div v-if="error" class="ion-padding">
        {{ error.data.msg }}
      </div>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import ModalLayout from '@/components/ModalLayout.vue'
import { useGet } from '@/composables'
import { Trayek } from '@/types'
import {
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonSpinner,
  IonToolbar,
  modalController,
} from '@ionic/vue'
import { computed, ref } from 'vue'

const query = ref('')
const { data, error, loading } = useGet<Trayek[]>('trayek')

const filterResults = computed(() =>
  query.value
    ? data.value.filter((trayek) =>
        trayek.kode.toLowerCase().includes(query.value.toLocaleLowerCase())
      )
    : data.value
)

const closeModal = (data: any) => modalController.dismiss(data)
</script>

<style lang="scss" scoped>
ion-toolbar {
  --background: #121212;
}

.searchbar {
  --ion-background-color: #212121 !important;
}

ion-searchbar {
  padding: 0 !important;
  margin-top: -16px;
}
</style>
