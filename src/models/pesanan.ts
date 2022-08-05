import { User } from "./user";

export interface Pesanan {
  id: number;
  driver: any;
  jemput: {
    type: string;
    coordinates: number[];
  };
  tujuan: {
    type: string;
    coordinates: number[];
  };
  penumpang: number;
  status: string;
}
