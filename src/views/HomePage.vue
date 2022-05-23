<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">eAngkot</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid class="ion-padding-horizontal">
        <ion-row>
          <ion-col>
            <h1>
              Halo, <strong>{{ auth.user.nama }}</strong>
            </h1>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <h3>Mau kemana hari ini?</h3>
            <ion-button router-link="/perjalanan" expand="block">
              Cari Angkot
            </ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-padding-top"> </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" setup>
import { useAuth } from "@/stores";
import {
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";

const auth = useAuth();
</script>
