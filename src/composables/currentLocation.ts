import { Geolocation } from '@capacitor/geolocation'
import { ref } from 'vue'

export const useCurrentLocation = () => {
  const coords = ref()

  Geolocation.getCurrentPosition().then((geo) => {
    coords.value = geo.coords
  })

  return coords
}
