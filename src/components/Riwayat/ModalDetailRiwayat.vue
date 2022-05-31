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
              v-model="ulasan.rating"
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
            placeholder="Berikan komentar"
            rows="3"
            v-model="ulasan.komentar"
            :readonly="transaksi.ulasan"
          ></IonTextarea>
        </IonItem>
      </IonList>
    </template>

    <template v-if="!transaksi.ulasan" #footer>
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
import { computed, defineProps, inject, reactive } from "vue";
import { useRiwayat } from "@/stores";
import { AxiosStatic } from "axios";
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
import { rupiah, showToast } from "@/utils";
import AppLayout from "@/layouts/AppLayout.vue";

const riwayat = useRiwayat();
const axios: AxiosStatic = inject("axios");

const props = defineProps({
  transaksi: {
    type: Object,
    required: true,
  },
});

const ulasan = reactive({
  rating: null,
  komentar: null,
});

const ongkos = computed(() => rupiah(props.transaksi.ongkos));

const back = async () => await modalController.dismiss();

const addUlasan = async () => {
  try {
    const res = await axios.patch(`transaksi/${props.transaksi.id}`, ulasan);
    const data = await res.data;

    if (data.status == "OK") {
      const transaksi = riwayat.findTransaksi(props.transaksi.id);
      transaksi.ulasan = data.data;
      riwayat.updateTransaksi(transaksi);

      await modalController.dismiss(true);
    }
  } catch (err) {
    await showToast(err.response.data.msg, "danger");
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
