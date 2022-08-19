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
import AppLayout from "@/layouts/AppLayout.vue";
import { useAuth } from "@/stores";
import { User } from "@/types";
import { Preferences } from "@capacitor/preferences";
import { IonButton, IonCol, IonGrid, IonRow, IonTitle } from "@ionic/vue";
import { onMounted, ref } from "vue";

const auth = useAuth();
const user = ref<User>(null);

onMounted(async () => await loadUser());

const loadUser = async () => {
  const { value } = await Preferences.get({ key: "user" });
  const token = await Preferences.get({ key: "token" });
  const userJson = JSON.parse(value);

  user.value = userJson;
  auth.setAuthUser(user.value, token.value);
};
</script>
