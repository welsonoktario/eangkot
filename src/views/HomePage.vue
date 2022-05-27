<template>
  <AppLayout>
    <template #header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </template>

    <template #content>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">eAngkot</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="ion-padding-horizontal">
        <ion-row v-if="user">
          <ion-col>
            <h1>
              Halo, <strong>{{ user.nama }}</strong>
            </h1>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <h3>Mau kemana hari ini?</h3>
            <ion-button router-link="/perjalanan" expand="block">
              Cari Angkot
            </ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-padding-top"> </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </AppLayout>
</template>
<script lang="ts" setup>
import { User } from "@/models";
import { useAuth } from "@/stores";
import { Storage } from "@capacitor/storage";
import {
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";

const auth = useAuth();
const user = ref<User>(null);

onMounted(async () => await loadUser());

const loadUser = async () => {
  const { value } = await Storage.get({ key: "user" });
  const token = await Storage.get({ key: "token" });
  const userJson = JSON.parse(value);

  user.value = userJson;
  auth.setAuthUser(user.value, token.value);
};
</script>
