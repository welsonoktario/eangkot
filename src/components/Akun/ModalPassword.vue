<template>
  <AppLayout>
    <template #header>
      <IonTitle>{{
        auth.authUser.secure ? "Ubah Password" : "Tambah Password"
      }}</IonTitle>
      <IonButtons slot="end">
        <IonButton @click="back()">
          <IonIcon
            slot="icon-only"
            :md="closeOutline"
            :ios="closeCircle"
          ></IonIcon>
        </IonButton>
      </IonButtons>
    </template>

    <template #content>
      <form>
        <IonList :inset="true" class="ion-padding">
          <IonItem v-if="auth.authUser.secure">
            <IonLabel position="floating">Password lama</IonLabel>
            <IonInput type="password" v-model="form.passwordLama"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{{
              auth.authUser.secure ? "Password baru" : "Password"
            }}</IonLabel>
            <IonInput type="password" v-model="form.password"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{{
              auth.authUser.secure ? "Ulangi password baru" : "Ulangi password"
            }}</IonLabel>
            <IonInput type="password" v-model="form.confirmPassword"></IonInput>
          </IonItem>
        </IonList>
      </form>
    </template>

    <template #footer>
      <IonButton
        @click="ubahPassword()"
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
import { inject, reactive } from "vue";
import { useAuth } from "@/stores";
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
import { AxiosStatic } from "axios";

const auth = useAuth();
const axios: AxiosStatic = inject("axios");

const form = reactive({
  passwordLama: "",
  password: "",
  confirmPassword: "",
});

const back = async () => await modalController.dismiss();

const ubahPassword = async () => {
  if (form.password == form.confirmPassword) {
    const res = await axios.patch(
      `user/${auth.authUser.id}/ubah-password`,
      form
    );
    const data = await res.data;

    if (data.status == "OK") {
      auth.authUser.secure = true;

      await auth.setAuthUser(auth.authUser);
      await modalController.dismiss(true);
    } else if (data.status == "NOT_MATCH") {
      console.error("pass lama ga cocok", data);
    } else {
      console.error("error", data);
    }
  } else {
    console.warn("password ga sama");
  }
};
</script>
