<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :md="home" :ios="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="riwayat" href="/tabs/riwayat">
          <ion-icon :md="time" :ios="timeOutline" />
          <ion-label>Riwayat</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="akun" href="/tabs/akun">
          <ion-icon :md="person" :ios="personOutline" />
          <ion-label>Akun</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue'
import {
  home,
  homeOutline,
  person,
  personOutline,
  time,
  timeOutline,
} from 'ionicons/icons'
</script>
