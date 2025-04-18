
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { 
  ArrowLeft, 
  Clock, 
  PackageCheck, 
  CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types";

const StatusStep = ({ status, current, label, icon }: 
  { status: string, current: string, label: string, icon: React.ReactNode }) => {
  const statusOrder = ['Preparing', 'Ready for Pickup', 'Completed'];
  const currentIndex = statusOrder.indexOf(current);
  const statusIndex = statusOrder.indexOf(status);
  
  const isActive = currentIndex >= statusIndex;
  
  return (
    <div className={`flex flex-col items-center ${isActive ? 'text-purple-600' : 'text-gray-400'}`}>
      <div className={`rounded-full p-3 ${isActive ? 'bg-purple-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <span className="mt-2 text-sm">{label}</span>
    </div>
  );
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, currentUser, updateOrderStatus } = useAppContext();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  
  useEffect(() => {
    if (orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    }
  }, [orderId, getOrderById]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Order not found</h2>
        <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/orders')}>View All Orders</Button>
      </div>
    );
  }

  const orderTotal = order.items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  
  const tax = orderTotal * 0.08; // 8% tax
  const total = orderTotal + tax;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="p-0 h-8"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
        </Button>
        <h1 className="text-2xl font-bold mt-2">Order #{order.orderNumber}</h1>
        <p className="text-gray-500">Placed on {formatDate(order.createdAt)}</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-4">
                <div className="flex justify-between mb-6">
                  <StatusStep 
                    status="Preparing" 
                    current={order.status} 
                    label="Preparing" 
                    icon={<Clock className="h-5 w-5" />} 
                  />
                  <div className={`h-1 flex-1 self-center mx-2 ${order.status !== 'Preparing' ? 'bg-purple-200' : 'bg-gray-200'}`} />
                  <StatusStep 
                    status="Ready for Pickup" 
                    current={order.status} 
                    label="Ready for Pickup" 
                    icon={<PackageCheck className="h-5 w-5" />} 
                  />
                  <div className={`h-1 flex-1 self-center mx-2 ${order.status === 'Completed' ? 'bg-purple-200' : 'bg-gray-200'}`} />
                  <StatusStep 
                    status="Completed" 
                    current={order.status} 
                    label="Completed" 
                    icon={<CheckCircle2 className="h-5 w-5" />} 
                  />
                </div>
                
                <div className="text-center mt-4">
                  <Badge className="px-3 py-1 text-sm">
                    {order.status}
                  </Badge>
                  <p className="mt-2 text-gray-600">
                    {order.status === 'Preparing' && "Your order is being prepared."}
                    {order.status === 'Ready for Pickup' && "Your order is ready! Head to the pickup counter."}
                    {order.status === 'Completed' && "Your order has been picked up. Enjoy!"}
                  </p>
                </div>
                
                {currentUser.isAdmin && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold mb-2">Update Status (Admin)</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant={order.status === 'Preparing' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      >
                        <Clock className="h-4 w-4 mr-1" /> Preparing
                      </Button>
                      <Button 
                        variant={order.status === 'Ready for Pickup' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}
                      >
                        <PackageCheck className="h-4 w-4 mr-1" /> Ready for Pickup
                      </Button>
                      <Button 
                        variant={order.status === 'Completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-start py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium">
                        {item.quantity}x {item.menuItem.name}
                      </div>
                      {item.specialInstructions && (
                        <div className="text-sm text-gray-600 mt-1">
                          {item.specialInstructions}
                        </div>
                      )}
                    </div>
                    <div className="font-medium">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderTotal.toFixed(2)}</span>
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
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-semibold mb-2">Pickup Information</h3>
                <p className="flex items-center text-gray-700 mb-1">
                  <Clock className="h-4 w-4 mr-2" /> {order.pickupTime}
                </p>
                <p className="text-sm text-gray-600">
                  Please show your order number when picking up.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
