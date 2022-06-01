<template>
  <AppLayout title="Riwayat" :largeTitle="true">
    <template #content>
      <DynamicScroller
        v-if="success"
        :items="results"
        :min-item-size="results.length"
        class="scroller"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[item.id]"
            :data-index="index"
          >
            <CardRiwayat @click="detail(item)" :transaksi="item" />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <div v-else-if="isLoading" class="spin">
        <ion-spinner></ion-spinner>
      </div>

      <IonGrid
        v-else-if="empty"
        fixed
        style="height: 100%; display: flex; flex-flow: column"
      >
        <IonRow class="ion-align-items-center" style="flex-grow: 1">
          <IonCol class="ion-text-center ion-margin-horizontal">
            <h2>Belum ada riwayat transaksi</h2>
            <IonButton router-link="/perjalanan" fill="clear">
              Cari Angkot
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonGrid
        v-else-if="error.isError"
        fixed
        style="height: 100%; display: flex; flex-flow: column"
      >
        <IonRow class="ion-align-items-center" style="flex-grow: 1">
          <IonCol class="ion-text-center ion-margin-horizontal">
            <h2>{{ error.msg }}</h2>
          </IonCol>
        </IonRow>
      </IonGrid>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useAuth, useRiwayat } from "@/stores";
import {
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  modalController,
} from "@ionic/vue";
import { showToast } from "@/utils";
import { Transaksi } from "@/models";
import AppLayout from "@/layouts/AppLayout.vue";
import ModalDetailRiwayat from "@/components/Riwayat/ModalDetailRiwayat.vue";
import CardRiwayat from "@/components/Riwayat/CardRiwayat.vue";

const context = getCurrentInstance();
const auth = useAuth();
const riwayat = useRiwayat();

const isLoading = ref(true);
const error = ref({
  isError: false,
  msg: "",
});
const results = ref<Transaksi[]>([]);

onMounted(async () => await loadRiwayat());

const empty = computed(
  () => !isLoading.value && !error.value.isError && !results.value.length
);

const success = computed(
  () => !isLoading.value && !error.value.isError && results.value.length
);

const loadRiwayat = async () => {
  const res = await riwayat.loadRiwayat(auth.authUser.id);
  const data = await res.data;
  isLoading.value = !isLoading.value;

  if (data.status === "OK") {
    results.value = data.data;

    if (results.value.length) {
      riwayat.setTransaksis(results.value);
    }
  }
};

const detail = async (transaksi: Transaksi) => {
  const modal = await modalController.create({
    component: ModalDetailRiwayat,
    componentProps: {
      id: transaksi.id,
    },
    canDismiss: true,
    presentingElement: context.parent.refs.ionRouterOutlet as HTMLElement,
  });

  await modal.present();

  const success = await (await modal.onDidDismiss()).data;

  if (success) {
    showToast("Ulasan berhasil ditambahkan", "success");
  }
};
</script>

<style scoped>
.spin {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

ion-spinner {
  width: 28px;
  height: 28px;
  stroke: #444;
  fill: #222;
}
</style>
