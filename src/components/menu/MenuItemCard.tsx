
import React from "react";
import { PlusCircle, Info } from "lucide-react";
import { MenuItem } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${!item.available ? 'opacity-60' : ''}`}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1 text-gray-600">
              {item.description}
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-orange-50"
              >
                <Info className="h-4 w-4 text-orange-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{item.name}</DialogTitle>
                <DialogDescription className="py-4 text-gray-600">
                  {item.description}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-orange-600">
                  R{item.price.toFixed(2)}
                </p>
                <Button 
                  onClick={() => onAddToCart(item)}
                  disabled={!item.available}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Add to Cart
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="font-semibold text-lg text-orange-600">
          R{item.price.toFixed(2)}
        </p>
        {!item.available && (
          <p className="text-red-500 text-sm mt-1">Currently unavailable</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(item)}
          disabled={!item.available}
          className="w-full bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
