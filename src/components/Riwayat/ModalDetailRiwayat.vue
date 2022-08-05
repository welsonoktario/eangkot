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
          <IonLabel>{{ transaksi.id }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="cash" :ios="cashOutline"></IonIcon>
          <IonLabel>{{ ongkos }}</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="time" :ios="timeOutline"></IonIcon>
          <IonLabel>{{ transaksi.durasiPerjalanan }} detik</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" :md="map" :ios="mapOutline"></IonIcon>
          <IonLabel>{{ transaksi.jarakPerjalanan }} km</IonLabel>
        </IonItem>
        <template v-if="transaksi.ulasan">
          <IonListHeader>
            <IonLabel>Rating dan Komentar</IonLabel>
          </IonListHeader>
          <IonItem class="item-input">
            <IonIcon slot="start" :md="star" :ios="starOutline"></IonIcon>
            <div class="select-wrapper">
              <IonLabel>Rating</IonLabel>
              <IonSelect
                :selectedText="transaksi.ulasan?.rating.toString()"
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
              :value="transaksi.ulasan?.komentar"
              :readonly="true"
            ></IonTextarea>
          </IonItem>
        </template>
      </IonList>

      <IonModal
        v-if="!transaksi.ulasan"
        :isOpen="isModalRatingOpen"
        v-on:didDismiss="isModalRatingOpen = false"
      >
        <ModalRating :id="id" />
      </IonModal>
    </template>

    <template v-if="!transaksi.ulasan" #footer>
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
const transaksi = ref(riwayat.findTransaksi(props.id));
const ongkos = computed(() => rupiah(transaksi.value.ongkos));
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
