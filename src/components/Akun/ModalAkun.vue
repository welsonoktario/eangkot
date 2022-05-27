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
        <IonTitle>Ubah Profil</IonTitle>
      </IonToolbar>
    </template>

    <template #content>
      <form @submit.prevent="ubahProfil()">
        <IonList>
          <IonItem>
            <IonLabel position="floating">Nama</IonLabel>
            <IonInput type="text" name="nama" placeholder="Nama"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              name="email"
              :placeholder="akun.email ? 'Email' : 'Tambah email'"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">No. HP</IonLabel>
            <IonInput type="tel" name="noHp" placeholder="No. HP"></IonInput>
          </IonItem>
        </IonList>
      </form>
    </template>

    <template #footer>
      <ion-button
        @click="ubahProfil()"
        class="ion-margin"
        expand="block"
        fill="solid"
      >
        Simpan
      </ion-button>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { defineProps, inject } from "vue";
import {
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
} from "@ionic/vue";
import AppLayout from "@/layouts/AppLayout.vue";

const props = defineProps({
  akun: Object,
});

const ubahProfil = async () => {
  return true;
};
</script>
