
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  ChevronDown, 
  Search 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatus } from "@/types";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, currentUser } = useAppContext();
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState("");

  if (!currentUser.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Admin Access Required</h2>
        <p className="text-gray-500 mb-6">You need admin privileges to view this page.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  // Sort orders: Ready for Pickup first, then Preparing, then Completed
  const sortedOrders = [...orders].sort((a, b) => {
    const statusPriority: { [key in OrderStatus]: number } = {
      'Ready for Pickup': 0,
      'Preparing': 1,
      'Completed': 2
    };
    
    return statusPriority[a.status] - statusPriority[b.status];
  });

  // Filter orders by status and search term
  const filteredOrders = sortedOrders.filter(order => {
    const matchesFilter = filter === 'All' || order.status === filter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Preparing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Ready for Pickup':
        return <PackageCheck className="h-5 w-5 text-blue-500" />;
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready for Pickup':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Filter: {filter} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('All')}>
                All Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Preparing')}>
                Preparing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Ready for Pickup')}>
                Ready for Pickup
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Completed')}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search order #"
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No orders found</h2>
          <p className="text-gray-500">
            {searchTerm 
              ? "No orders match your search criteria" 
              : filter !== 'All' 
                ? `No ${filter.toLowerCase()} orders` 
                : "No orders have been placed yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-2 bg-gray-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)} • Pickup: {order.pickupTime}
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm pb-1">
                        <span>{item.quantity}x {item.menuItem.name}</span>
                        <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="font-semibold flex justify-between">
                      <span>Total:</span>
                      <span>
                        ${order.items.reduce(
                          (sum, item) => sum + (item.menuItem.price * item.quantity),
                          0
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <p className="text-sm mb-2">Update Status:</p>
                    <div className="flex space-x-2">
                      <Button
                        variant={order.status === 'Preparing' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1 h-8"
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      >
                        <Clock className="h-3 w-3 mr-1" /> Preparing
                      </Button>
                      <Button
                        variant={order.status === 'Ready for Pickup' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1 h-8"
                        onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}
                      >
                        <PackageCheck className="h-3 w-3 mr-1" /> Ready
                      </Button>
                      <Button
                        variant={order.status === 'Completed' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1 h-8"
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Done
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
