<template>
  <modal-layout title="Detail Riwayat" @start-click="back()">
    <template #content>
      <ion-list inset>
        <ion-list-header>
          <ion-label>Detail Pesanan</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-icon
            slot="start"
            :md="calendar"
            :ios="calendarOutline"
          ></ion-icon>
          <ion-label>{{ pesanan.tanggal }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="person" :ios="personOutline"></ion-icon>
          <ion-label
            >{{ pesanan.driver.user.nama }},
            {{ pesanan.driver.angkot.noKendaraan }}</ion-label
          >
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="car" :ios="carOutline"></ion-icon>
          <ion-label>{{ pesanan.driver.angkot.trayek.kode }}</ion-label>
        </ion-item>

        <ion-list-header>
          <ion-label>Detail Transaksi</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-icon
            slot="start"
            :md="calendar"
            :ios="calendarOutline"
          ></ion-icon>
          <ion-label>{{ pesanan.transaksi.tanggal }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="cash" :ios="cashOutline"></ion-icon>
          <ion-label>{{ ongkos }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="time" :ios="timeOutline"></ion-icon>
          <ion-label>{{ durasi }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="map" :ios="mapOutline"></ion-icon>
          <ion-label>{{ pesanan.transaksi.jarakPerjalanan }} km</ion-label>
        </ion-item>
        <template v-if="pesanan.transaksi.ulasan">
          <ion-list-header>
            <ion-label>Rating dan Komentar</ion-label>
          </ion-list-header>
          <ion-item class="item-input">
            <ion-icon slot="start" :md="star" :ios="starOutline"></ion-icon>
            <div class="select-wrapper">
              <ion-label>Rating</ion-label>
              <ion-select
                :selectedText="pesanan.transaksi.ulasan?.rating.toString()"
                :disabled="true"
              >
                <ion-select-option value="1">1</ion-select-option>
                <ion-select-option value="2">2</ion-select-option>
                <ion-select-option value="3">3</ion-select-option>
                <ion-select-option value="4">4</ion-select-option>
                <ion-select-option value="5">5</ion-select-option>
              </ion-select>
            </div>
          </ion-item>
          <ion-item class="ion-margin-bottom item-input">
            <ion-label position="stacked">Komentar</ion-label>
            <ion-textarea
              placeholder="Berikan komentar"
              :rows="3"
              :autoGrow="true"
              :value="pesanan.transaksi.ulasan?.komentar"
              :readonly="true"
            ></ion-textarea>
          </ion-item>
        </template>
      </ion-list>

      <ion-modal
        v-if="!pesanan.transaksi.ulasan"
        :isOpen="isModalRatingOpen"
        v-on:didDismiss="isModalRatingOpen = false"
      >
        <modal-rating :id="id" />
      </ion-modal>
    </template>

    <template v-if="!pesanan.transaksi.ulasan" #footer>
      <e-a-button
        @click="isModalRatingOpen = true"
        class="ion-margin"
        expand="block"
        fill="solid"
      >
        Berikan Ulasan
      </e-a-button>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import EAButton from "@/components/EAButton.vue";
import ModalLayout from "@/components/ModalLayout.vue";
import { useRiwayat } from "@/stores";
import { rupiah } from "@/utils";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  modalController,
} from "@ionic/vue";
import {
  calendar,
  calendarOutline,
  car,
  carOutline,
  cash,
  cashOutline,
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
