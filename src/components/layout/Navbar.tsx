
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User, ChefHat, Bell, BellOff, Check } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, currentUser, toggleAdminMode, notifications, markNotificationAsRead, clearNotifications } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: "Menu", path: "/" },
    { name: "Cart", path: "/cart" },
    { name: "My Orders", path: "/orders" },
  ];

  // Admin-only navigation items
  const adminItems = [
    { name: "Manage Orders", path: "/admin/orders" },
    { name: "Manage Menu", path: "/admin/menu" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNotificationClick = (notificationId: string, orderId?: string) => {
    markNotificationAsRead(notificationId);
    if (orderId) {
      navigate(`/orders/${orderId}`);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-purple-600">CampusEats</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-purple-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {currentUser.isAdmin && 
              adminItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-purple-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))
            }
            
            <button 
              onClick={toggleAdminMode}
              className="ml-4 flex items-center text-sm text-gray-600 hover:text-purple-600"
            >
              {currentUser.isAdmin ? (
                <>
                  <User className="h-4 w-4 mr-1" />
                  <span>Student Mode</span>
                </>
              ) : (
                <>
                  <ChefHat className="h-4 w-4 mr-1" />
                  <span>Admin Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-1 text-gray-700 hover:text-purple-600 focus:outline-none">
                  {unreadNotifications > 0 ? (
                    <Bell className="h-6 w-6" />
                  ) : (
                    <BellOff className="h-6 w-6" />
                  )}
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <span className="font-medium">Notifications</span>
                  {notifications.length > 0 && (
                    <button 
                      className="text-xs text-purple-600 hover:text-purple-800"
                      onClick={clearNotifications}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <BellOff className="h-6 w-6 mx-auto mb-2" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className={`p-3 cursor-pointer ${notification.read ? 'opacity-60' : 'font-medium bg-purple-50'}`}
                        onClick={() => handleNotificationClick(notification.id, notification.orderId)}
                      >
                        <div className="flex w-full">
                          <div className="flex-1">
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</p>
                          </div>
                          {!notification.read && (
                            <div className="flex items-start ml-2">
                              <Badge variant="outline" className="bg-purple-100 text-purple-600 text-xs">New</Badge>
                            </div>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              to="/cart" 
              className="relative flex items-center text-gray-700 hover:text-purple-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-purple-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {currentUser.isAdmin && 
              adminItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-purple-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))
            }
            
            <button 
              onClick={() => {
                toggleAdminMode();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-purple-50"
            >
              {currentUser.isAdmin ? "Switch to Student Mode" : "Switch to Admin Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
