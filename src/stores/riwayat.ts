import { Transaksi } from "@/models";
import { defineStore } from "pinia";

export const useRiwayat = defineStore("riwayat", {
  state: () => ({
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
      const index = this._transaksis.findIndex(
        (t: Transaksi) => t.id == transaksi.id
      );
      this._transaksis[index] = transaksi;
    },
    findTransaksi(id: number) {
      return this._transaksis.find((t: Transaksi) => t.id === id) as Transaksi;
    },
  },
});
