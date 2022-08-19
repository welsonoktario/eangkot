<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet></IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon :md="home" :ios="homeOutline" />
          <IonLabel>Home</IonLabel>
        </IonTabButton>

        <IonTabButton tab="riwayat" href="/tabs/riwayat">
          <IonIcon :md="time" :ios="timeOutline" />
          <IonLabel>Riwayat</IonLabel>
        </IonTabButton>

        <IonTabButton tab="akun" href="/tabs/akun">
          <IonIcon :md="person" :ios="personOutline" />
          <IonLabel>Akun</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
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
} from "@ionic/vue";
import {
  home,
  homeOutline,
  person,
  personOutline,
  time,
  timeOutline,
} from "ionicons/icons";
</script>
