
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Minus, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    updateCartItemInstructions,
    timeSlots,
    selectedTimeSlot,
    selectTimeSlot,
    placeOrder,
  } = useAppContext();

  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [instructions, setInstructions] = useState("");

  // Calculate total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleEditInstructions = (itemId: string, currentInstructions?: string) => {
    setEditingItemId(itemId);
    setInstructions(currentInstructions || "");
  };

  const saveInstructions = () => {
    if (editingItemId) {
      updateCartItemInstructions(editingItemId, instructions);
      setEditingItemId(null);
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    setShowTimeDialog(true);
  };

  const handlePlaceOrder = () => {
    const orderId = placeOrder();
    if (orderId) {
      navigate(`/orders/${orderId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button onClick={() => navigate('/')}>Browse Menu</Button>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <Card key={item.menuItem.id}>
                <CardHeader className="py-4 px-6">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{item.menuItem.name}</CardTitle>
                    <span className="font-semibold">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFromCart(item.menuItem.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                  
                  {item.specialInstructions ? (
                    <div className="mt-3 text-sm text-gray-600">
                      <p className="font-semibold">Special Instructions:</p>
                      <p>{item.specialInstructions}</p>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 mt-1 h-auto"
                        onClick={() => handleEditInstructions(item.menuItem.id, item.specialInstructions)}
                      >
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 mt-3 h-auto"
                      onClick={() => handleEditInstructions(item.menuItem.id)}
                    >
                      Add Special Instructions
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
              <Button onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      {/* Instructions Dialog */}
      <Dialog open={editingItemId !== null} onOpenChange={(open) => !open && setEditingItemId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Special Instructions</DialogTitle>
            <DialogDescription>
              Add any special instructions for this item.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g., No onions, extra sauce, etc."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingItemId(null)}
            >
              Cancel
            </Button>
            <Button onClick={saveInstructions}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Slot Selection Dialog */}
      <Dialog open={showTimeDialog} onOpenChange={setShowTimeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Pickup Time</DialogTitle>
            <DialogDescription>
              Choose a time to pick up your order.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup 
              defaultValue={selectedTimeSlot?.id} 
              onValueChange={(value) => selectTimeSlot(value)}
            >
              {timeSlots.map((slot) => {
                const isFull = slot.currentOrders >= slot.maxOrders;
                return (
                  <div 
                    key={slot.id} 
                    className={`mb-3 p-3 border rounded-md flex items-center justify-between ${
                      isFull ? 'bg-gray-100 opacity-60' : 'hover:border-purple-500 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center">
                      <RadioGroupItem 
                        value={slot.id} 
                        id={`time-${slot.id}`} 
                        disabled={isFull}
                      />
                      <Label 
                        htmlFor={`time-${slot.id}`} 
                        className="ml-2 flex items-center"
                      >
                        <Clock className="h-4 w-4 mr-2" /> {slot.time}
                      </Label>
                    </div>
                    <div className="text-sm text-gray-500">
                      {isFull ? (
                        <span className="text-red-500">Full</span>
                      ) : (
                        <span>{slot.maxOrders - slot.currentOrders} spots left</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTimeDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePlaceOrder}
              disabled={!selectedTimeSlot}
            >
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
