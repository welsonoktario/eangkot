import { Pesanan } from "./pesanan";
import { Ulasan } from "./ulasan";

export interface Transaksi {
  id: number;
  ongkos: number;
  durasiPerjalanan: number;
  jarakPerjalanan: number;
  pesanan: Pesanan;
  ulasan?: Ulasan;
}
