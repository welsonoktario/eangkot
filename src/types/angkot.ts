import { LngLatLike } from 'mapbox-gl'
import { Trayek } from './trayek'
import { User } from './user'

export type Angkot = {
  id: number
  noKendaraan: string
  lokasi: LngLatLike
  trayek: Trayek
  driver: User
  penumpang?: User[]
}
