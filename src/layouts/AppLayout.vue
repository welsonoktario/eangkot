<template>
  <ion-page>
    <ion-header>
      <slot name="header"></slot>
    </ion-header>

    <ion-content>
      <slot name="content"></slot>
    </ion-content>

    <ion-footer v-if="slots['footer']">
      <slot name="footer"></slot>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts" setup>
import { useSlots } from "vue";
import { IonPage, IonContent, IonHeader, IonFooter } from "@ionic/vue";

const slots = useSlots();
</script>
