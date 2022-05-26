import { Transaksi } from "@/models";
import { defineStore } from "pinia";

export const useRiwayat = defineStore("riwayat", {
  state: () => ({
    transaksis: [] as Transaksi[],
  }),
  getters: {
    transaksis: (state) => state.transaksis
  },
  actions: {
    
  }
});
