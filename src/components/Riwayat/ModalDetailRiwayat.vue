<template>
  <AppLayout>
    <template #header>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton @click="back()">
            <IonIcon
              slot="icon-only"
              md="close-outline"
              ios="close-circle"
              color="medium"
            ></IonIcon>
          </IonButton>
        </IonButtons>
        <IonTitle>Detail Riwayat</IonTitle>
      </IonToolbar>
    </template>

    <template #content>
      <IonList>
        <IonListHeader>
          <IonLabel>Pengemudi</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonIcon slot="start" md="person" ios="person-outline"></IonIcon>
          <IonLabel
            >{{ transaksi.pesanan.driver.user.nama }},
            {{ transaksi.pesanan.driver.angkot[0].no_kendaraan }}</IonLabel
          >
        </IonItem>
        <IonItem>
          <IonIcon slot="start" md="car" ios="car-outline"></IonIcon>
          <IonLabel>{{
            transaksi.pesanan.driver.angkot[0].trayek.kode
          }}</IonLabel>
        </IonItem>

        <IonListHeader>
          <IonLabel>Detail Perjalanan</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonIcon slot="start" ios="calendar-outline"></IonIcon>
          <IonLabel>{{ transaksi.tanggal }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" md="cash" ios="cash-outline"></IonIcon>
          <IonLabel>{{ ongkos }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" md="time" ios="time-outline"></IonIcon>
          <IonLabel>{{ transaksi.detail.durasiPerjalanan }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" md="map" ios="map-outline"></IonIcon>
          <IonLabel>{{ transaksi.detail.jarakPerjalanan }} km</IonLabel>
        </IonItem>
        <IonListHeader>
          <IonLabel>Rating dan Komentar</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonLabel>Rating</IonLabel>
          <IonSelect
            :value="transaksi.ulasan ? transaksi.ulasan.rating : null"
            :disabled="transaksi.ulasan ? true : false"
          >
            <IonSelectOption value="1">1</IonSelectOption>
            <IonSelectOption value="2">2</IonSelectOption>
            <IonSelectOption value="3">3</IonSelectOption>
            <IonSelectOption value="4">4</IonSelectOption>
            <IonSelectOption value="5">5</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonTextarea
            rows="3"
            :readonly="transaksi.ulasan"
            :value="transaksi.ulasan ? transaksi.ulasan.komentar : null"
            placeholder="Berikan komentar"
          ></IonTextarea>
        </IonItem>
      </IonList>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";
import {
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  modalController,
} from "@ionic/vue";
import { rupiah } from "@/utils";

const props = defineProps({
  transaksi: {
    type: Object,
    required: true,
  },
});

const ongkos = computed(() => rupiah(props.transaksi.ongkos));

const back = async () => await modalController.dismiss();
</script>
