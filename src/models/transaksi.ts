import { TransaksiDetail, Ulasan } from "@/models";

export interface Transaksi {
  id: number;
  tanggal: string;
  ongkos: number;
  detail: TransaksiDetail;
  ulasan?: Ulasan;
}
