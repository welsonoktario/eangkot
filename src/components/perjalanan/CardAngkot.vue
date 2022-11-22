<template>
  <ion-card>
    <ion-row>
      <ion-item style="width: 100%" button>
        <ion-label>
          <h2>{{ angkot.driver.nama }}</h2>
          <p>{{ angkot.noKendaraan }}</p>
        </ion-label>
        <ion-label slot="end" class="ion-align-items-center">
          <span class="ion-margin-right">
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
import { IonCard, IonIcon, IonItem, IonLabel, IonRow } from '@ionic/vue'
import { star } from 'ionicons/icons'

type CardAngkotProps = {
  angkot: Angkot
}

defineProps<CardAngkotProps>()
</script>
