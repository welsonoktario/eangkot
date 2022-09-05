<template>
  <modal-layout
    :title="auth.authUser.hasPassword ? 'Ubah Password' : 'Tambah Password'"
    @start-click="back()"
  >
    <template #content>
      <form>
        <ion-list :inset="true" class="ion-padding">
          <ion-item v-if="auth.authUser.hasPassword">
            <ion-label position="floating">Password lama</ion-label>
            <ion-input type="password" v-model="form.passwordLama"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{
              auth.authUser.hasPassword ? "Password baru" : "Password"
            }}</ion-label>
            <ion-input type="password" v-model="form.password"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{
              auth.authUser.hasPassword
                ? "Ulangi password baru"
                : "Ulangi password"
            }}</ion-label>
            <ion-input
              type="password"
              v-model="form.confirmPassword"
            ></ion-input>
          </ion-item>
        </ion-list>
      </form>
    </template>

    <template #footer>
      <e-a-button
        @click="ubahPassword()"
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

const form = ref({
  passwordLama: "",
  password: "",
  confirmPassword: "",
});

const back = async () => await modalController.dismiss();

const ubahPassword = async () => {
  if (form.value.password == form.value.confirmPassword) {
    const res = await auth.ubahPassword(form);
    const data = await res.data;

    if (data.status == "OK") {
      auth.authUser.hasPassword = true;

      await auth.setAuthUser(auth.authUser);
      await modalController.dismiss(true);
    } else if (data.status == "NOT_MATCH") {
      await showToast("Password lama tidak cocok", "danger");
    } else {
      await showToast(data.msg, "danger");
    }
  } else {
    await showToast("Password baru tidak cocok", "warning");
  }
};
</script>
