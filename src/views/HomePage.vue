<template>
  <AppLayout title="eAngkot" :largeTitle="true">
    <template #header>
      <AppBar title="Home" />
    </template>

    <template #content>
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
            <e-a-button router-link="/perjalanan" expand="block">
              Cari Angkot
            </e-a-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </AppLayout>
</template>
<script lang="ts" setup>
import AppBar from "@/components/AppBar.vue";
import EAButton from "@/components/EAButton.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { useAuth } from "@/stores";
import { User } from "@/types";
import { Preferences } from "@capacitor/preferences";
import { IonCol, IonGrid, IonRow, loadingController } from "@ionic/vue";
import { onMounted, ref } from "vue";

const auth = useAuth();
const user = ref<User>(null);

onMounted(async () => await loadUser());

const loadUser = async () => {
  const loading = await loadingController.create({
    message: "Mohon tunggu...",
  });

  await loading.present();

  const { value } = await Preferences.get({ key: "user" });
  const token = await Preferences.get({ key: "token" });
  const userJson = JSON.parse(value);

  user.value = userJson;
  auth.setAuthUser(user.value, token.value);

  await loading.dismiss();
};
</script>
