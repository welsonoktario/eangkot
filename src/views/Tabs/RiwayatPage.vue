<template>
  <app-layout>
    <template #header>
      <app-bar title="Riwayat" />
    </template>

    <template #content>
      <ion-list v-if="riwayat.transaksis.length" lines="none" class="h-full">
        <card-riwayat
          v-for="transaksi in riwayat.transaksis"
          @click="detail(transaksi.id)"
          :transaksi="transaksi"
          :key="`transaksi-${transaksi.id}`"
        />
      </ion-list>

      <div v-else-if="loading" class="spin">
        <ion-spinner></ion-spinner>
      </div>

      <ion-grid
        v-else-if="!riwayat.transaksis.length"
        fixed
        style="height: 100%; display: flex; flex-flow: column"
      >
        <ion-row class="ion-align-items-center" style="flex-grow: 1">
          <ion-col class="ion-text-center ion-margin-horizontal">
            <h2>Belum ada riwayat transaksi</h2>
            <ion-button router-link="/perjalanan" fill="clear">
              Cari Angkot
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-grid
        v-else-if="error"
        fixed
        style="height: 100%; display: flex; flex-flow: column"
      >
        <ion-row class="ion-align-items-center" style="flex-grow: 1">
          <ion-col class="ion-text-center ion-margin-horizontal">
            <h2>{{ error.msg }}</h2>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import CardRiwayat from '@/components/Riwayat/CardRiwayat.vue'
import ModalDetailRiwayat from '@/components/Riwayat/ModalDetailRiwayat.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useRiwayat } from '@/stores'
import {
  IonButton,
  IonCol,
  IonGrid,
  IonList,
  IonRow,
  IonSpinner,
  modalController,
} from '@ionic/vue'

const riwayat = useRiwayat()
const { error, loading } = riwayat.loadRiwayat()

const detail = async (id: number) => {
  const modal = await modalController.create({
    component: ModalDetailRiwayat,
    componentProps: {
      id,
    },
    breakpoints: [0, 0.75, 1],
    initialBreakpoint: 0.75,
  })

  await modal.present()
}
</script>

<style scoped>
.h-full {
  height: 100%;
}
</style>
