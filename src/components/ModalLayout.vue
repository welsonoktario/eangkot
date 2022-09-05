<template>
  <IonHeader class="ion-no-border">
    <AppBar :title="title">
      <template #start>
        <IonButtons>
          <IonButton class="ion-no-padding" fill="clear" @click="onStartClick">
            <IonIcon
              slot="icon-only"
              color="primary"
              :icon="closeOutline"
            ></IonIcon>
          </IonButton>
        </IonButtons>
      </template>

      <template #end v-if="endIcon">
        <IonButton @click="onEndClick">
          <IonIcon slot="icon-only" color="primary" :icon="endIcon"></IonIcon>
        </IonButton>
      </template>
    </AppBar>

    <slot name="header" v-if="slots.header" />
  </IonHeader>

  <IonContent>
    <slot name="content" />
  </IonContent>

  <IonFooter v-if="slots.footer">
    <slot name="footer" />
  </IonFooter>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
} from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
import { useSlots } from "vue";
import AppBar from "./AppBar.vue";

defineProps({
  title: String,
  startIcon: {
    type: String,
    default: closeOutline,
  },
  endIcon: String,
});

const emits = defineEmits<{
  (e: "startClick", params?: any): void;
  (e: "endClick", params?: any): void;
}>();

const slots = useSlots();

const onStartClick = (params: any) => emits("startClick", params);
const onEndClick = (params: any) => emits("endClick", params);
</script>
