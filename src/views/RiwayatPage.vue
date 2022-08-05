<template>
  <AppLayout title="Riwayat" :largeTitle="true">
    <template #content>
      <IonList v-if="riwayat.transaksis.length" lines="none" class="h-full">
        <CardRiwayat
          v-for="item in riwayat.transaksis"
          @click="detail(item)"
          :transaksi="item"
          :key="item.id"
        />
      </IonList>

      <div v-else-if="loading" class="spin">
        <ion-spinner></ion-spinner>
      </div>

      <IonGrid
        v-else-if="!riwayat.transaksis.length"
        fixed
        style="height: 100%; display: flex; flex-flow: column"
      >
        <IonRow class="ion-align-items-center" style="flex-grow: 1">
          <IonCol class="ion-text-center ion-margin-horizontal">
            <h2>Belum ada riwayat transaksi</h2>
            <IonButton router-link="/perjalanan" fill="clear">
              Cari Angkot
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonGrid
        v-else-if="error"
        fixed
        style="height: 100%; display: flex; flex-flow: column"
      >
        <IonRow class="ion-align-items-center" style="flex-grow: 1">
          <IonCol class="ion-text-center ion-margin-horizontal">
            <h2>{{ error.msg }}</h2>
          </IonCol>
        </IonRow>
      </IonGrid>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from "vue";
import { useRiwayat } from "@/stores";
import {
  IonList,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  modalController,
} from "@ionic/vue";
import { Transaksi } from "@/models";
import AppLayout from "@/layouts/AppLayout.vue";
import ModalDetailRiwayat from "@/components/Riwayat/ModalDetailRiwayat.vue";
import CardRiwayat from "@/components/Riwayat/CardRiwayat.vue";

const context = getCurrentInstance();
const riwayat = useRiwayat();
const { error, loading } = riwayat.loadRiwayat();

const detail = async (transaksi: Transaksi) => {
  const modal = await modalController.create({
    component: ModalDetailRiwayat,
    componentProps: {
      id: transaksi.id,
    },
    canDismiss: true,
    presentingElement: context.parent.refs.ionRouterOutlet as HTMLElement,
  });

  await modal.present();
};
</script>

<style scoped>
.h-full {
  height: 100%;
}
</style>
