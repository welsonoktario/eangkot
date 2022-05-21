import { defineStore } from "pinia";
import { GoogleMap } from "@capacitor/google-maps";

type MapsState = {
  map: GoogleMap | undefined;
};

export const useMaps = defineStore("maps", {
  state: () =>
    ({
      map: undefined,
    } as MapsState),
  getters: {
    map: (state) => state.map,
  },
  actions: {
    setMap(map: GoogleMap) {
      this.map = map;
    },
    async createMap(id: string) {
      const mapRef = document.getElementById(id) as HTMLElement;

      return await GoogleMap.create({
        id: "map", // Unique identifier for this map instance
        element: mapRef, // reference to the capacitor-google-map element
        apiKey: "AIzaSyA5RTB9884v4aCF-SumhIDUqoWKJ-OUmfg", // Your Google Maps API Key
        config: {
          center: {
            // The initial position to be rendered by the map
            lat: -7.2621774,
            lng: 112.7518702,
          },
          zoom: 13, // The initial zoom level to be rendered by the map
        },
      });

      return this.map;
    },
  },
});
