
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockIcon, CheckCircle2, PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const { orders } = useAppContext();
  
  // Sort orders by creation date (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Preparing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'Ready for Pickup':
        return <PackageCheck className="h-5 w-5 text-blue-500" />;
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ready for Pickup':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {sortedOrders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No orders yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <Link to={`/orders/${order.id}`} key={order.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                      <CardDescription>
                        {formatDate(order.createdAt)} • Pickup: {order.pickupTime}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}: {' '}
                    {order.items.slice(0, 2).map((item, index) => (
                      <span key={index}>
                        {item.quantity}x {item.menuItem.name}
                        {index < Math.min(order.items.length, 2) - 1 ? ', ' : ''}
                      </span>
                    ))}
                    {order.items.length > 2 && ` and ${order.items.length - 2} more`}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
