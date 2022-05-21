<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="riwayat" href="/tabs/riwayat">
          <ion-icon :icon="time" />
          <ion-label>Riwayat</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="akun" href="/tabs/akun">
          <ion-icon :icon="person" />
          <ion-label>Akun</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { home, time, person } from "ionicons/icons";
</script>
