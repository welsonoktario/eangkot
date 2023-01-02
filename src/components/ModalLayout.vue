<template>
  <ion-header v-if="!noHeader" class="ion-no-border">
    <app-bar :title="title">
      <template #start>
        <ion-buttons>
          <ion-button class="ion-no-padding" fill="clear" @click="onStartClick">
            <ion-icon
              slot="icon-only"
              color="primary"
              :icon="closeOutline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </template>

      <template #end v-if="endIcon">
        <ion-buttons @click="onEndClick">
          <e-a-button fill="clear"
            ><ion-icon
              slot="icon-only"
              color="primary"
              :icon="endIcon"
            ></ion-icon
          ></e-a-button>
        </ion-buttons>
      </template>
    </app-bar>

    <slot name="header" v-if="slots.header" />
  </ion-header>

  <ion-content :fullscreen="!noHeader">
    <slot name="content" />
  </ion-content>

  <ion-footer v-if="slots.footer">
    <slot name="footer" />
  </ion-footer>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
} from '@ionic/vue'
import { closeOutline } from 'ionicons/icons'
import { useSlots } from 'vue'
import AppBar from './AppBar.vue'
import EAButton from './EAButton.vue'

defineProps({
  title: String,
  startIcon: {
    type: String,
    default: closeOutline,
  },
  endIcon: String,
  noHeader: Boolean,
})

const emits = defineEmits<{
  (e: 'startClick', params?: any): void
  (e: 'endClick', params?: any): void
}>()

const slots = useSlots()

const onStartClick = (params: any) => emits('startClick', params)
const onEndClick = (params: any) => emits('endClick', params)
</script>
