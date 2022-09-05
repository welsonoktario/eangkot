<template>
  <modal-layout title="Ubah Profil" @start-click="back()">
    <template #content>
      <form @submit.prevent="ubahProfil()">
        <ion-list :inset="true" class="ion-padding">
          <ion-item>
            <ion-label position="floating">Nama</ion-label>
            <ion-input
              type="text"
              name="nama"
              placeholder="Nama"
              v-model="akun.nama"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input
              type="email"
              name="email"
              :placeholder="akun.email ? 'Email' : 'Tambah email'"
              v-model="akun.email"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">No. HP</ion-label>
            <ion-input
              type="tel"
              name="noHp"
              placeholder="No. HP"
              v-model="akun.noHp"
            ></ion-input>
          </ion-item>
        </ion-list>
      </form>
    </template>

    <template #footer>
      <e-a-button
        @click="ubahProfil()"
        class="ion-margin"
        expand="block"
        fill="solid"
      >
        Simpan
      </e-a-button>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import EAButton from "@/components/EAButton.vue";
import ModalLayout from "@/components/ModalLayout.vue";
import { useAuth } from "@/stores";
import { showToast } from "@/utils";
import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  modalController,
} from "@ionic/vue";
import { ref } from "vue";

const auth = useAuth();

const akun = ref(auth.authUser);

const ubahProfil = async () => {
  const res = await auth.ubahProfil(akun.value);
  const data = await res.data;

  if (data.status === "OK") {
    await auth.setAuthUser(akun.value);
    await modalController.dismiss(true);
  } else if (data.status === "FAIL") {
    await showToast(data.msg, "danger");
  }
};

const back = async () => await modalController.dismiss();
</script>
