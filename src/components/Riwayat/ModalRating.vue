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
      <IonList>
        <IonItem class="item-input">
          <IonIcon slot="start" :md="star" :ios="starOutline"></IonIcon>
          <div class="select-wrapper">
            <IonLabel>Rating</IonLabel>
            <IonSelect v-model="ulasan.rating">
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
            v-model="ulasan.komentar"
            placeholder="Berikan komentar"
            :rows="3"
          ></IonTextarea>
        </IonItem>
      </IonList>
    </template>

    <template #footer>
      <IonButton
        @click="addUlasan()"
        class="ion-margin"
        expand="block"
        fill="solid"
      >
        Tambah Ulasan
      </IonButton>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import AppLayout from "@/layouts/AppLayout.vue";
import { Ulasan } from "@/models";
import { useRiwayat } from "@/stores";
import { showToast } from "@/utils";
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  modalController,
} from "@ionic/vue";
import { closeCircle, closeOutline, star, starOutline } from "ionicons/icons";
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
