<template>
  <AppLayout>
    <template #header>
      <IonTitle>Detail Riwayat</IonTitle>
      <IonButtons slot="end">
        <IonButton @click="back()">
          <IonIcon
            slot="icon-only"
            :md="closeOutline"
            :ios="closeCircle"
            color="medium"
          ></IonIcon>
        </IonButton>
      </IonButtons>
    </template>

    <template #content>
      <IonList :inset="true">
        <IonListHeader>
          <IonLabel>Pengemudi</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonIcon slot="start" :md="person" :ios="personOutline"></IonIcon>
          <IonLabel
            >{{ transaksi.pesanan.driver.user.nama }},
            {{ transaksi.pesanan.driver.angkot.noKendaraan }}</IonLabel
          >
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="car" :ios="carOutline"></IonIcon>
          <IonLabel>{{ transaksi.pesanan.driver.angkot.trayek.kode }}</IonLabel>
        </IonItem>

        <IonListHeader>
          <IonLabel>Detail Perjalanan</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonIcon slot="start" :md="calendar" :ios="calendarOutline"></IonIcon>
          <IonLabel>{{ transaksi.tanggal }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="cash" :ios="cashOutline"></IonIcon>
          <IonLabel>{{ ongkos }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="time" :ios="timeOutline"></IonIcon>
          <IonLabel>{{ transaksi.detail.durasi }} detik</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="map" :ios="mapOutline"></IonIcon>
          <IonLabel>{{ transaksi.detail.jarak }} km</IonLabel>
        </IonItem>
        <IonListHeader>
          <IonLabel>Rating dan Komentar</IonLabel>
        </IonListHeader>
        <IonItem class="item-input">
          <IonIcon slot="start" :md="star" :ios="starOutline"></IonIcon>
          <div class="select-wrapper">
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
          </div>
        </IonItem>
        <IonItem class="ion-margin-bottom item-input">
          <IonLabel position="stacked">Komentar</IonLabel>
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
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  modalController,
} from "@ionic/vue";
import {
  calendar,
  calendarOutline,
  cash,
  cashOutline,
  map,
  mapOutline,
  person,
  personOutline,
  car,
  carOutline,
  time,
  timeOutline,
  closeOutline,
  closeCircle,
  star,
  starOutline,
} from "ionicons/icons";
import { rupiah } from "@/utils";
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
  transaksi: {
    type: Object,
    required: true,
  },
});

const ongkos = computed(() => rupiah(props.transaksi.ongkos));

const back = async () => await modalController.dismiss();
</script>

<style scoped>
.md .item-input {
  margin: 0 16px 0 16px;
}

.select-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
