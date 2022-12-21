<template>
  <ion-card>
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
          4.3
        </ion-label>
      </ion-item>
    </ion-row>
  </ion-card>
</template>

<script lang="ts" setup>
import { Angkot } from '@/types'
import {
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonRow,
  modalController,
} from '@ionic/vue'
import { star } from 'ionicons/icons'
import ModalPerjalananDetail from './ModalPerjalananDetail.vue'

type CardAngkotProps = {
  angkot: Angkot
}

defineProps<CardAngkotProps>()

const openModalDetail = async () => {
  const modal = await modalController.create({
    component: ModalPerjalananDetail,
  })

  await modal.present()
}
</script>
