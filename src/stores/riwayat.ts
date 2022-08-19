import { Pesanan, Ulasan } from "@/types";
import { get, patch } from "@/utils/http";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useRiwayat = defineStore("riwayat", {
  state: () =>
    reactive({
      _pesanans: [] as Pesanan[],
    }),
  getters: {
    pesanans: (state) => state._pesanans,
  },
  actions: {
    setPesanans(pesanans: Pesanan[]) {
      this._pesanans = pesanans;
    },
    updatePesanan(pesanan: Pesanan) {
      const index = this._pesanans.findIndex(
        (p: Pesanan) => p.id === pesanan.id
      );
      this._pesanans[index].ulasan = pesanan.transaksi.ulasan;
    },
    findPesanan(id: number) {
      return this._pesanans.find((p: Pesanan) => p.id === id) as Pesanan;
    },
    loadRiwayat() {
      const error = ref<any | null>(null);
      const loading = ref<boolean>(true);

      get("pesanan")
        .then((res) => (this._pesanans = res.data.data))
        .catch((err) => (error.value = err))
        .finally(() => (loading.value = false));

      return { error, loading };
    },
    async addUlasan(id: number, ulasan: Ulasan) {
      return await patch(`transaksi/${id}`, ulasan);
    },
  },
});
