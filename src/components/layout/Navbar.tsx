
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, ChefHat } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, currentUser, toggleAdminMode } = useAppContext();
  const location = useLocation();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

          <div className="flex items-center">
            <Link 
              to="/cart" 
              className="ml-4 relative flex items-center text-gray-700 hover:text-purple-600"
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
              className="ml-4 md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
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
