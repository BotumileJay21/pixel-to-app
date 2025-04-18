
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { PlusCircle, Info } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { menuItems, addToCart } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [itemToView, setItemToView] = useState<string | null>(null);

  // Get unique categories from menu items
  const categories = Array.from(new Set(menuItems.map(item => item.category)));
  
  // Filter menu items by selected category
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Eats</h1>
        <p className="text-gray-600 text-center max-w-md">
          Order delicious food from your campus restaurants for convenient pickup.
        </p>
      </div>
      
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className="rounded-full"
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className={`overflow-hidden ${!item.available ? 'opacity-60' : ''}`}>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {item.description}
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setItemToView(item.id)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{item.name}</DialogTitle>
                      <DialogDescription className="py-4">{item.description}</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
                      <Button 
                        onClick={() => {
                          addToCart(item);
                        }}
                        disabled={!item.available}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="font-semibold text-lg">${item.price.toFixed(2)}</p>
              {!item.available && (
                <p className="text-red-500 text-sm mt-1">Currently unavailable</p>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                onClick={() => addToCart(item)}
                disabled={!item.available}
                variant="default"
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
