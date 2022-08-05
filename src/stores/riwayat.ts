import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { Transaksi, Ulasan } from "@/models";
import { get, patch } from "@/utils/http";

export const useRiwayat = defineStore("riwayat", {
  state: () =>
    reactive({
      _transaksis: [] as Transaksi[],
    }),
  getters: {
    transaksis: (state) => state._transaksis,
  },
  actions: {
    setTransaksis(transaksis: Transaksi[]) {
      this._transaksis = transaksis;
    },
    updateTransaksi(transaksi: Transaksi) {
      this._transaksis.find((t: Transaksi) => t.id == transaksi.id).ulasan =
        transaksi.ulasan;
    },
    findTransaksi(id: number) {
      return this._transaksis.find((t: Transaksi) => t.id === id) as Transaksi;
    },
    loadRiwayat() {
      const error = ref<any | null>(null);
      const loading = ref<boolean>(true);

      get("transaksi")
        .then((res) => (this._transaksis = res.data.data))
        .catch((err) => (error.value = err))
        .finally(() => (loading.value = false));

      return { error, loading };
    },
    async addUlasan(id: number, ulasan: Ulasan) {
      return await patch(`transaksi/${id}`, ulasan);
    },
  },
});
