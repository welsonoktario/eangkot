<template>
  <AppLayout>
    <template #header>
      <IonButtons slot="start">
        <IonButton @click="closeModal(null)">
          <IonIcon slot="icon-only" :icon="arrowBack"></IonIcon>
        </IonButton>
      </IonButtons>
      <IonTitle>OTP</IonTitle>
    </template>

    <template #content>
      <IonLabel>Kode OTP</IonLabel>
      <div style="display: flex; flex-direction: row; width: 100%">
        <VOtpInput
          ref="pin"
          separator="-"
          :num-inputs="4"
          :should-auto-focus="true"
          :is-input-num="true"
          :placeholder="['*', '*', '*', '*']"
          @on-complete="handleOnComplete"
        />
      </div>
    </template>

    <template #footer>
      <IonButton @click="checkOtp()" class="ion-margin" expand="block">
        Lanjut
      </IonButton>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { $ref } from "vue/macros";
import { useAuth } from "@/stores";
import {
  IonLabel,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  modalController,
} from "@ionic/vue";
import { Dialog } from "@capacitor/dialog";
import { arrowBack } from "ionicons/icons";
import AppLayout from "@/layouts/AppLayout.vue";
import VOtpInput from "vue3-otp-input";

const auth = useAuth();

const props = defineProps({
  phone: {
    type: String,
    required: true,
  },
});

let pin = $ref("");

onMounted(() => requestOtp());

const handleOnComplete = (value: string) => {
  pin = value;
};

const closeModal = (data: any) => modalController.dismiss(data);

const requestOtp = async () => await auth.requestOTP(props.phone);

const checkOtp = async () => {
  const res = await auth.checkOTP(props.phone, pin);
  const data = await res.data;

  if (data.msg) {
    await modalController.dismiss(true);
  } else {
    await Dialog.alert({
      title: "Error",
      message: "Kode OTP tidak cocok",
    });
  }
};
</script>
