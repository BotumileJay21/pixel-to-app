
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import MenuItemCard from "@/components/menu/MenuItemCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { menuItems, addToCart, currentUser } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(menuItems.map(item => item.category)));
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-center mb-8 space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Campus Eats</h1>
        <p className="text-xl text-orange-600 font-medium">
          {greeting()}, {currentUser.name.split(' ')[0]}! 🍽️
        </p>
        <p className="text-gray-600 text-center max-w-md">
          Delicious food from your campus restaurants, ready when you are.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="rounded-full bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full ${
              selectedCategory === category 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'hover:bg-orange-50 hover:text-orange-600'
            } transition-colors duration-200`}
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
