<template>
  <IonPage>
    <IonHeader class="ion-no-border">
      <slot name="header"> </slot>
    </IonHeader>

    <IonContent>
      <slot name="content"></slot>
    </IonContent>

    <IonFooter v-if="slots['footer']">
      <slot name="footer"></slot>
    </IonFooter>
  </IonPage>
</template>

<script lang="ts" setup>
import { IonContent, IonFooter, IonHeader, IonPage } from "@ionic/vue";
import { useSlots } from "vue";

const slots = useSlots();
</script>

<style>
.md ion-toolbar {
  --ion-background-color: var(--ion-color-primary);
}

.md ion-toolbar ion-title {
  --color: var(--ion-color-primary-contrast);
}

.md ion-toolbar ion-buttons ion-button {
  --color: var(--ion-color-primary-contrast) !important;
}

.ios ion-toolbar ion-buttons ion-button {
  --color: var(--ion-color-medium) !important;
}

.md ion-toolbar ion-buttons ion-back-button {
  --color: var(--ion-color-primary-contrast) !important;
}
</style>
