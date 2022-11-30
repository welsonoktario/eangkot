import { Angkot } from './angkot'
import { Ulasan } from './ulasan'
import { User } from './user'

export type Transaksi = {
  id: number
  ongkos: number
  durasiPerjalanan: number
  jarakPerjalanan: number
  lokasiJemput: string
  lokasiTujuan: string
  tanggal: string
  user: User
  angkot: Angkot
  ulasan?: Ulasan
}

export type AddTransaksi = {
  user: number
  driver: number
  ongkos: number
  durasiPerjalanan: number
  jarakPerjalanan: number
  lokasiJemput: string
  lokasiTujuan: string
}
