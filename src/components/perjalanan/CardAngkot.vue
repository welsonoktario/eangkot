<template>
  <ion-card>
    <ion-row v-if="statusPesanan !== StatusPesanan.DONE">
      <h2 v-if="statusPesanan === StatusPesanan.ACCEPT">Pesanan anda telah diterima oleh pengemudi</h2>
      <h2 v-if="statusPesanan === StatusPesanan.PROCESS">Sedang dalam proses perjalanan</h2>
    </ion-row>
    <ion-row>
      <ion-item style="width: 100%" button @click="openModalDetail">
        <ion-label>
          <h2>{{ angkot.driver.nama }}</h2>
          <p>{{ angkot.noKendaraan }}</p>
        </ion-label>
        <ion-label slot="end" class="ion-align-items-center">
          <span>
            <ion-icon :icon="star" color="primary"></ion-icon>
          </span>
          {{ rating }}
        </ion-label>
      </ion-item>
    </ion-row>
  </ion-card>
</template>

<script lang="ts" setup>
import { Angkot } from '@/types'
import { StatusPesanan } from '@/types/statusEnum'
import {
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  modalController,
} from '@ionic/vue'
import { star } from 'ionicons/icons'
import { computed } from 'vue'
import ModalPerjalananDetail from './ModalPerjalananDetail.vue'

type CardAngkotProps = {
  statusPesanan: StatusPesanan
  angkot: Angkot
}

const props = defineProps<CardAngkotProps>()

const rating = computed(() => {
  try {
    return props.angkot.driver.rating.toFixed(1)
  } catch (e) {
    console.error(e)
    return 0
  }
})

const openModalDetail = async () => {
  const modal = await modalController.create({
    component: ModalPerjalananDetail,
  })

  await modal.present()
}
</script>
