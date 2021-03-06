<template>
  <AppLayout title="Akun" :largeTitle="true">
    <template #content>
      <IonItem class="ion-padding-vertical" lines="none">
        <IonLabel v-if="auth.authUser" class="ion-text-center">
          <h1>{{ auth.authUser.nama }}</h1>
          <p v-if="auth.authUser.email">{{ auth.authUser.email }}</p>
          <p>{{ auth.authUser.noHp }}</p>
        </IonLabel>
      </IonItem>

      <IonList lines="full">
        <IonItem
          routerLink="/tabs/riwayat"
          routerDirection="root"
          button
          detail
        >
          <IonIcon slot="start" :md="time" :ios="timeOutline"></IonIcon>
          <IonLabel>Riwayat perjalanan</IonLabel>
        </IonItem>
        <IonItem @click="profil()" button detail>
          <IonIcon slot="start" :md="person" :ios="personOutline"></IonIcon>
          <IonLabel>Ubah profil</IonLabel>
        </IonItem>
        <IonItem @click="password()" button detail>
          <IonIcon slot="start" :md="key" :ios="keyOutline"></IonIcon>
          <IonLabel>{{
            auth.authUser?.secure ? "Ubah password" : "Tambah password"
          }}</IonLabel>
        </IonItem>
        <IonItem @click="share()" button detail>
          <IonIcon slot="start" :md="people" :ios="peopleOutline"></IonIcon>
          <IonLabel>Bagikan eAngkot</IonLabel>
        </IonItem>
        <IonItem button detail>
          <IonIcon slot="start" :md="help" :ios="helpCircleOutline"></IonIcon>
          <IonLabel>Bantuan</IonLabel>
        </IonItem>
      </IonList>
      <IonItem
        @click="logout()"
        lines="none"
        class="ion-margin-top"
        button
        detail
      >
        <IonIcon
          slot="start"
          :md="logOut"
          :ios="logOutOutline"
          color="danger"
        ></IonIcon>
        <IonLabel color="danger">Keluar</IonLabel>
      </IonItem>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from "vue";
import { useAuth } from "@/stores";
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  modalController,
  useIonRouter,
} from "@ionic/vue";
import {
  time,
  timeOutline,
  person,
  personOutline,
  key,
  keyOutline,
  people,
  peopleOutline,
  help,
  helpCircleOutline,
  logOut,
  logOutOutline,
} from "ionicons/icons";
import { Share } from "@capacitor/share";
import { showToast } from "@/utils";
import AppLayout from "@/layouts/AppLayout.vue";
import ModalAkun from "@/components/Akun/ModalAkun.vue";
import ModalPassword from "@/components/Akun/ModalPassword.vue";

const context = getCurrentInstance();
const auth = useAuth();
const ionRouter = useIonRouter();

const profil = async () => {
  const modal = await modalController.create({
    component: ModalAkun,
    canDismiss: true,
    presentingElement: context.parent.refs.ionRouterOutlet as HTMLElement,
  });

  await modal.present();

  const success = await (await modal.onDidDismiss()).data;

  if (success) {
    await showToast("Profil berhasil diperbarui", "success");
  }
};

const password = async () => {
  const modal = await modalController.create({
    component: ModalPassword,
    canDismiss: true,
    presentingElement: context.parent.refs.ionRouterOutlet as HTMLElement,
  });

  await modal.present();

  const success = await (await modal.onDidDismiss()).data;

  if (success) {
    await showToast("Password berhasil diperbarui", "success");
  }
};

const share = async () =>
  await Share.share({
    text: "Download dan gunakan eAngkot sekarang juga!",
    url: "https://google.com/",
    dialogTitle: "Downdload eAngkot",
  });

const logout = async () => {
  await auth.logout();
  ionRouter.navigate("/auth/login", "root", "replace");
};
</script>
