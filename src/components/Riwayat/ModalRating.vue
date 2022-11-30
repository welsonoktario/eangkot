<template>
  <modal-layout title="Beri Ulasan" @start-click="back()">
    <template #content>
      <ion-list>
        <ion-item class="item-input">
          <ion-icon slot="start" :md="star" :ios="starOutline"></ion-icon>
          <div class="select-wrapper">
            <ion-label>Rating</ion-label>
            <ion-select v-model="ulasan.rating">
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
            v-model="ulasan.komentar"
            placeholder="Berikan komentar"
            :rows="3"
          ></ion-textarea>
        </ion-item>
      </ion-list>
    </template>

    <template #footer>
      <e-a-button
        @click="addUlasan()"
        class="ion-margin"
        expand="block"
        fill="solid"
      >
        Tambah Ulasan
      </e-a-button>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import EAButton from "@/components/EAButton.vue";
import ModalLayout from "@/components/ModalLayout.vue";
import { useRiwayat } from "@/stores";
import { Ulasan } from "@/types";
import { showToast } from "@/utils";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  modalController,
} from "@ionic/vue";
import { star, starOutline } from "ionicons/icons";
import { ref } from "vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const riwayat = useRiwayat();
const ulasan = ref<Ulasan>({
  id: 0,
  rating: 0,
  komentar: "",
});

const back = async () => await modalController.dismiss();

const addUlasan = async () => {
  const transaksi = riwayat.findTransaksi(props.id);
  const res = await riwayat.addUlasan(props.id, ulasan.value);
  const { data, status } = res;

  if (status !== 500) {
    transaksi.ulasan = data.data;
    await modalController.dismiss();
    showToast("Ulasan berhasil ditambahkan", "success");
  } else {
    showToast("Terjadi kesalahan sistem", "danger");
  }
};
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
