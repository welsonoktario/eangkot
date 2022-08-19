import { Ulasan } from "./ulasan";

export interface Transaksi {
  id: number;
  ongkos: number;
  durasiPerjalanan: number;
  jarakPerjalanan: number;
  tanggal: string;
  ulasan?: Ulasan;
}
