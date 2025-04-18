
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
};

export type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
};

export type TimeSlot = {
  id: string;
  time: string;
  maxOrders: number;
  currentOrders: number;
};

export type OrderStatus = 'Preparing' | 'Ready for Pickup' | 'Completed';

export type Order = {
  id: string;
  items: CartItem[];
  orderNumber: string;
  pickupTime: string;
  status: OrderStatus;
  createdAt: string;
  userId?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};
