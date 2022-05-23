<template>
  <app-layout>
    <template #header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>

        <ion-title>Register</ion-title>
      </ion-toolbar>
    </template>

    <template #content>
      <ion-list>
        <ion-item>
          <ion-label position="floating">Nama</ion-label>
          <ion-input
            required
            type="text"
            autocomplete="name"
            v-model="nama"
          ></ion-input>
        </ion-item>
      </ion-list>
    </template>

    <template #footer>
      <ion-button
        @click="register()"
        class="ion-margin"
        expand="block"
        color="primary"
        :disabled="nama ? false : true"
      >
        Daftar
      </ion-button>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/stores/auth";
import { AxiosStatic } from "axios";
import AppLayout from "@/layouts/AppLayout.vue";
import {
  IonToolbar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  useIonRouter,
} from "@ionic/vue";
import { User } from "@/models/user";

const route = useRoute();
const ionRouter = useIonRouter();
const auth = useAuth();
const axios: AxiosStatic = inject("axios");

const { phone } = route.params;
const nama = ref("");

const register = async () => {
  const res = await axios.post("auth/register", { nama: nama.value, phone });
  const data = await res.data;

  if (data.status == "OK") {
    await auth.setAuthUser(data.user as User, data.token);
    ionRouter.push("/tabs/home");
  }
};
</script>
