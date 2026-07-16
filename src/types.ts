export interface FanSeat {
  section: string;
  row: string;
  seat: string;
}

export interface Fan {
  id: string;
  name: string;
  phoneNumber: string;
  selectedStadium: string;
  seat: FanSeat | null;
  lastLogin?: string | number | Date;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  options?: string;
}

export interface ActiveOrder {
  orderNo: string;
  items: CartItem[];
  total: number;
  secondsLeft: number;
  status: "PREPARING" | "READY";
}
