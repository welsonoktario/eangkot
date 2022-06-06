<template>
  <AppLayout title="eAngkot" :largeTitle="true">
    <template #header>
      <IonTitle>Home</IonTitle>
    </template>

    <template #content>
      <IonGrid class="ion-padding-horizontal">
        <IonRow v-if="user">
          <IonCol>
            <h1>
              Halo, <strong>{{ user.nama }}</strong>
            </h1>
            <p>{{ lokasi }}</p>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <h3>Mau kemana hari ini?</h3>
            <ion-button router-link="/perjalanan" expand="block">
              Cari Angkot
            </ion-button>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="ion-padding-top"> </IonCol>
        </IonRow>
      </IonGrid>
    </template>
  </AppLayout>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useAuth } from "@/stores";
import {
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonTitle,
  loadingController,
} from "@ionic/vue";
import { Storage } from "@capacitor/storage";
import { User } from "@/models";
import AppLayout from "@/layouts/AppLayout.vue";

const auth = useAuth();
const user = ref<User>(null);
const lokasi = ref("");

onMounted(async () => await loadUser());

const loadUser = async () => {
  const loading = await loadingController.create({
    message: "Mohon tunggu...",
  });

  await loading.present();

  const { value } = await Storage.get({ key: "user" });
  const token = await Storage.get({ key: "token" });
  const userJson = JSON.parse(value);

  user.value = userJson;
  auth.setAuthUser(user.value, token.value);
  
  await loading.dismiss();
};
</script>
