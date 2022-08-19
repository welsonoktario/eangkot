<template>
  <AppLayout title="Riwayat" :largeTitle="true">
    <template #content>
      <IonList v-if="riwayat.pesanans.length" lines="none" class="h-full">
        <CardRiwayat
          v-for="item in riwayat.pesanans"
          @click="detail(item.id)"
          :transaksi="item.transaksi"
          :key="item.id"
        />
      </IonList>

      <div v-else-if="loading" class="spin">
        <ion-spinner></ion-spinner>
      </div>

      <IonGrid
        v-else-if="!riwayat.pesanans.length"
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
import CardRiwayat from "@/components/Riwayat/CardRiwayat.vue";
import ModalDetailRiwayat from "@/components/Riwayat/ModalDetailRiwayat.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { useRiwayat } from "@/stores";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonList,
  IonRow,
  IonSpinner,
  modalController,
} from "@ionic/vue";
import { getCurrentInstance } from "vue";

const context = getCurrentInstance();
const riwayat = useRiwayat();
const { error, loading } = riwayat.loadRiwayat();

const detail = async (id: number) => {
  const modal = await modalController.create({
    component: ModalDetailRiwayat,
    componentProps: {
      id,
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
