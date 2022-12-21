<template>
  <modal-layout title="Detail Perjalanan" @start-click="close()">
    <template #content>
      <ion-item style="width: 100%">
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
      <ion-item>
        <ion-label slot="start">
          <h3>Trayek</h3>
        </ion-label>
        <ion-label slot="end">
          <p>{{ trayek.kode }}</p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-label>
          <h3>Lokasi Jemput</h3>
          <p>{{ jemputStr }}</p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-label>
          <h3>Lokasi Tujuan</h3>
          <p>{{ tujuanStr }}</p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-label>
          <h3>Estimasi Durasi Perjalanan</h3>
          <p>{{ durasiStr }}</p>
        </ion-label>
      </ion-item>
      <ion-item>
        <ion-label>
          <h3>Ongkos</h3>
          <p>{{ ongkosStr }}</p>
        </ion-label>
      </ion-item>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import ModalLayout from '@/Components/ModalLayout.vue'
import { usePerjalanan } from '@/stores'
import { IonItem, IonLabel, modalController } from '@ionic/vue'
import { star } from 'ionicons/icons';

const { angkot, trayek, durasiStr, ongkosStr, jemputStr, tujuanStr } = usePerjalanan()

const close = async () => await modalController.dismiss()
</script>
