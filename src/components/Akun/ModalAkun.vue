<template>
  <AppLayout title="Ubah Profil">
    <template #header>
      <IonButtons slot="end">
        <IonButton @click="back()">
          <IonIcon
            slot="icon-only"
            :md="closeOutline"
            :ios="closeCircle"
          ></IonIcon>
        </IonButton>
      </IonButtons>
      <IonTitle>Ubah Profil</IonTitle>
    </template>

    <template #content>
      <form @submit.prevent="ubahProfil()">
        <IonList :inset="true" class="ion-padding">
          <IonItem>
            <IonLabel position="floating">Nama</IonLabel>
            <IonInput
              type="text"
              name="nama"
              placeholder="Nama"
              v-model="akun.nama"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              name="email"
              :placeholder="akun.email ? 'Email' : 'Tambah email'"
              v-model="akun.email"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">No. HP</IonLabel>
            <IonInput
              type="tel"
              name="noHp"
              placeholder="No. HP"
              v-model="akun.noHp"
            ></IonInput>
          </IonItem>
        </IonList>
      </form>
    </template>

    <template #footer>
      <IonButton
        @click="ubahProfil()"
        class="ion-margin"
        expand="block"
        fill="solid"
      >
        Simpan
      </IonButton>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { inject, ref } from "vue";
import { useAuth } from "@/stores";
import { AxiosStatic } from "axios";
import {
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  modalController,
} from "@ionic/vue";
import { closeOutline, closeCircle } from "ionicons/icons";
import AppLayout from "@/layouts/AppLayout.vue";

const auth = useAuth();
const axios: AxiosStatic = inject("axios");

const akun = ref(auth.authUser);

const ubahProfil = async () => {
  const res = await axios.patch(`user/${akun.value.id}`, akun.value);
  const data = await res.data;

  if (data.status === "OK") {
    await auth.setAuthUser(akun.value);
    await modalController.dismiss(true);
  }
};

const back = async () => await modalController.dismiss();
</script>
