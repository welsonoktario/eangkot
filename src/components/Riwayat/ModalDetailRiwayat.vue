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
      <IonList inset>
        <IonListHeader>
          <IonLabel>Detail Pesanan</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonIcon slot="start" :md="calendar" :ios="calendarOutline"></IonIcon>
          <IonLabel>{{ pesanan.tanggal }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="person" :ios="personOutline"></IonIcon>
          <IonLabel
            >{{ pesanan.driver.user.nama }},
            {{ pesanan.driver.angkot.noKendaraan }}</IonLabel
          >
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="car" :ios="carOutline"></IonIcon>
          <IonLabel>{{ pesanan.driver.angkot.trayek.kode }}</IonLabel>
        </IonItem>

        <IonListHeader>
          <IonLabel>Detail Transaksi</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonIcon slot="start" :md="calendar" :ios="calendarOutline"></IonIcon>
          <IonLabel>{{ pesanan.transaksi.tanggal }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="cash" :ios="cashOutline"></IonIcon>
          <IonLabel>{{ ongkos }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="time" :ios="timeOutline"></IonIcon>
          <IonLabel>{{ durasi }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="map" :ios="mapOutline"></IonIcon>
          <IonLabel>{{ pesanan.transaksi.jarakPerjalanan }} km</IonLabel>
        </IonItem>
        <template v-if="pesanan.transaksi.ulasan">
          <IonListHeader>
            <IonLabel>Rating dan Komentar</IonLabel>
          </IonListHeader>
          <IonItem class="item-input">
            <IonIcon slot="start" :md="star" :ios="starOutline"></IonIcon>
            <div class="select-wrapper">
              <IonLabel>Rating</IonLabel>
              <IonSelect
                :selectedText="pesanan.transaksi.ulasan?.rating.toString()"
                :disabled="true"
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
              placeholder="Berikan komentar"
              :rows="3"
              :autoGrow="true"
              :value="pesanan.transaksi.ulasan?.komentar"
              :readonly="true"
            ></IonTextarea>
          </IonItem>
        </template>
      </IonList>

      <IonModal
        v-if="!pesanan.transaksi.ulasan"
        :isOpen="isModalRatingOpen"
        v-on:didDismiss="isModalRatingOpen = false"
      >
        <ModalRating :id="id" />
      </IonModal>
    </template>

    <template v-if="!pesanan.transaksi.ulasan" #footer>
      <IonButton
        @click="isModalRatingOpen = true"
        class="ion-margin"
        expand="block"
        fill="solid"
      >
        Berikan Ulasan
      </IonButton>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import AppLayout from "@/layouts/AppLayout.vue";
import { useRiwayat } from "@/stores";
import { rupiah } from "@/utils";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  modalController,
} from "@ionic/vue";
import {
  calendar,
  calendarOutline,
  car,
  carOutline,
  cash,
  cashOutline,
  closeCircle,
  closeOutline,
  map,
  mapOutline,
  person,
  personOutline,
  star,
  starOutline,
  time,
  timeOutline,
} from "ionicons/icons";
import { computed, ref } from "vue";
import ModalRating from "./ModalRating.vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const riwayat = useRiwayat();
const pesanan = ref(riwayat.findPesanan(props.id));
const ongkos = computed(() => rupiah(pesanan.value.transaksi.ongkos));
const durasi = computed(() => {
  const d = pesanan.value.transaksi.durasiPerjalanan;
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? h + " jam " : "";
  const mDisplay = m > 0 ? m + " menit " : "";
  const sDisplay = s > 0 ? s + " detik" : "";

  return hDisplay + mDisplay + sDisplay;
});
const isModalRatingOpen = ref(false);

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
