import { Transaksi } from "@/models";
import { defineStore } from "pinia";

export const useRiwayat = defineStore("riwayat", {
  state: () => ({
    transaksis: [] as Transaksi[],
  }),
  getters: {
    transaksis: (state) => state.transaksis,
  },
  actions: {
    setTransaksis(transaksis: Transaksi[]) {
      if (transaksis.length) {
        this.transaksis = transaksis;
      }
    },
    updateTransaksi(transaksi: Transaksi) {
      const index = this.transaksis.findIndex(
        (t: Transaksi) => t.id == transaksi.id
      );
      this.transaksis[index] = transaksi;
    },
    findTransaksi(id: number) {
      return this.transaksis.find((t: Transaksi) => t.id === id);
    },
  },
});
