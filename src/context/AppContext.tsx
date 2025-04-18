
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, TimeSlot, Order, User, OrderStatus } from '@/types';
import { toast } from "@/hooks/use-toast";

// Mock data - in a real app this would come from an API
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Cheeseburger',
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and special sauce',
    price: 6.99,
    category: 'Burgers',
    available: true,
  },
  {
    id: '2',
    name: 'Veggie Bowl',
    description: 'Fresh mixed vegetables, quinoa, and avocado with citrus dressing',
    price: 8.99,
    category: 'Bowls',
    available: true,
  },
  {
    id: '3',
    name: 'Chicken Sandwich',
    description: 'Grilled chicken breast with lettuce, tomato, and mayo on a brioche bun',
    price: 7.49,
    category: 'Sandwiches',
    available: true,
  },
  {
    id: '4',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
    price: 6.99,
    category: 'Salads',
    available: true,
  },
  {
    id: '5',
    name: 'French Fries',
    description: 'Crispy golden fries seasoned with sea salt',
    price: 3.49,
    category: 'Sides',
    available: true,
  },
  {
    id: '6',
    name: 'Chocolate Shake',
    description: 'Rich and creamy chocolate milkshake topped with whipped cream',
    price: 4.99,
    category: 'Drinks',
    available: true,
  }
];

const mockTimeSlots: TimeSlot[] = [
  { id: '1', time: '11:30 AM', maxOrders: 10, currentOrders: 2 },
  { id: '2', time: '12:00 PM', maxOrders: 10, currentOrders: 5 },
  { id: '3', time: '12:30 PM', maxOrders: 10, currentOrders: 8 },
  { id: '4', time: '1:00 PM', maxOrders: 10, currentOrders: 3 },
  { id: '5', time: '1:30 PM', maxOrders: 10, currentOrders: 1 },
  { id: '6', time: '2:00 PM', maxOrders: 10, currentOrders: 0 },
];

// Initial user state - simulating a logged-in user
const initialUser: User = {
  id: 'user1',
  name: 'Student User',
  email: 'student@university.edu',
  isAdmin: false,
};

type AppContextType = {
  menuItems: MenuItem[];
  cartItems: CartItem[];
  timeSlots: TimeSlot[];
  orders: Order[];
  selectedTimeSlot: TimeSlot | null;
  currentUser: User;
  
  // Cart functions
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  updateCartItemInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  
  // Time slot functions
  selectTimeSlot: (slotId: string) => void;
  
  // Order functions
  placeOrder: () => string | null;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Admin functions
  toggleAdminMode: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(mockTimeSlots);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);

  // Add item to cart
  const addToCart = (item: MenuItem, quantity: number = 1) => {
    if (!item.available) {
      toast({
        title: "Item Unavailable",
        description: "Sorry, this item is currently unavailable",
        variant: "destructive"
      });
      return;
    }

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.menuItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item already in cart
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item to cart
        return [...prevItems, { menuItem: item, quantity }];
      }
    });

    // Prompt user to select a time slot if they haven't already
    if (!selectedTimeSlot) {
      toast({
        title: "Select Pickup Time",
        description: "Remember to select a pickup time before placing your order.",
      });
    }

    toast({
      title: "Added to Cart",
      description: `${item.name} added to your cart`
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.menuItem.id !== itemId)
    );
  };

  // Update cart item quantity
  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.menuItem.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Update special instructions for cart item
  const updateCartItemInstructions = (itemId: string, instructions: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.menuItem.id === itemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setSelectedTimeSlot(null);
  };

  // Select time slot
  const selectTimeSlot = (slotId: string) => {
    const slot = timeSlots.find(slot => slot.id === slotId);
    if (slot) {
      if (slot.currentOrders >= slot.maxOrders) {
        toast({
          title: "Time Slot Full",
          description: "Sorry, this time slot is already at capacity",
          variant: "destructive"
        });
        return;
      }
      setSelectedTimeSlot(slot);
      
      toast({
        title: "Pickup Time Selected",
        description: `Your order will be ready for pickup at ${slot.time}`,
      });
    }
  };

  // Place order
  const placeOrder = (): string | null => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before placing an order.",
        variant: "destructive"
      });
      return null;
    }

    if (!selectedTimeSlot) {
      toast({
        title: "No Time Selected",
        description: "Please select a pickup time before placing your order.",
        variant: "destructive"
      });
      return null;
    }
    
    // Check if the selected time slot is still available
    const currentSlot = timeSlots.find(slot => slot.id === selectedTimeSlot.id);
    if (!currentSlot || currentSlot.currentOrders >= currentSlot.maxOrders) {
      toast({
        title: "Time Slot Full",
        description: "The selected time slot is no longer available. Please choose another time.",
        variant: "destructive"
      });
      return null;
    }

    // Generate a random order number (in a real app this would be from the server)
    const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      items: [...cartItems],
      pickupTime: selectedTimeSlot.time,
      status: 'Preparing',
      createdAt: new Date().toISOString(),
      userId: currentUser.id,
    };

    // Update orders list
    setOrders(prevOrders => [...prevOrders, newOrder]);

    // Update time slot's current orders
    setTimeSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === selectedTimeSlot.id
          ? { ...slot, currentOrders: slot.currentOrders + 1 }
          : slot
      )
    );

    // Clear cart after successful order
    clearCart();

    toast({
      title: "Order Placed!",
      description: `Your order #${orderNumber} has been confirmed for pickup at ${selectedTimeSlot.time}`,
    });

    return newOrder.id;
  };

  // Get order by ID
  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  // Update order status (admin function)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    if (!currentUser.isAdmin) {
      toast({
        title: "Unauthorized",
        description: "Only admins can update order status",
        variant: "destructive"
      });
      return;
    }

    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status }
          : order
      )
    );

    const updatedOrder = orders.find(o => o.id === orderId);
    
    toast({
      title: "Order Updated",
      description: `Order #${updatedOrder?.orderNumber} status changed to ${status}`,
    });
    
    // In a real app, we'd notify the user here through WebSockets or push notifications
  };

  // Toggle between admin and user modes (for demo purposes)
  const toggleAdminMode = () => {
    setCurrentUser(prev => ({
      ...prev,
      isAdmin: !prev.isAdmin
    }));
    
    toast({
      title: "Mode Changed",
      description: `Switched to ${!currentUser.isAdmin ? 'Admin' : 'Student'} mode`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        menuItems,
        cartItems,
        timeSlots,
        orders,
        selectedTimeSlot,
        currentUser,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        updateCartItemInstructions,
        clearCart,
        selectTimeSlot,
        placeOrder,
        getOrderById,
        updateOrderStatus,
        toggleAdminMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
