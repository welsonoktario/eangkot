import { LngLatLike } from 'mapbox-gl'
import { Driver } from './driver'
import { Trayek } from './trayek'
import { User } from './user'

export type Angkot = {
  id: number
  docId?: string
  noKendaraan: string
  lokasi: LngLatLike
  trayek: Trayek
  driver: Driver
  penumpang?: User[]
}
