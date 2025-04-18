
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MenuItem } from "@/types";

const AdminMenu = () => {
  const navigate = useNavigate();
  const { menuItems, currentUser } = useAppContext();
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  const [formState, setFormState] = useState<MenuItem>({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    available: true
  });

  if (!currentUser.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Admin Access Required</h2>
        <p className="text-gray-500 mb-6">You need admin privileges to view this page.</p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item.id);
    setFormState({ ...item });
  };

  const handleSaveItem = () => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === editingItem ? { ...formState } : item
      )
    );
    setEditingItem(null);
  };

  const handleAddNewItem = () => {
    const newItem: MenuItem = {
      ...formState,
      id: `new-${Date.now()}`,
      available: true
    };
    
    setItems(prevItems => [...prevItems, newItem]);
    setFormState({
      id: "",
      name: "",
      description: "",
      price: 0,
      category: "",
      available: true
    });
    setIsAddingItem(false);
  };

  const handleToggleAvailability = (itemId: string) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    if (editingItem === itemId) {
      setEditingItem(null);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number | boolean = value;
    
    if (name === "price") {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormState(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Menu</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search menu items..."
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new menu item.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleFormChange}
                    placeholder="Item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formState.category}
                    onChange={handleFormChange}
                    placeholder="Category"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleFormChange}
                    placeholder="Item description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (R)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formState.price}
                    onChange={handleFormChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNewItem}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
            {editingItem === item.id ? (
              // Edit mode
              <>
                <CardHeader className="pb-2">
                  <Input
                    name="name"
                    value={formState.name}
                    onChange={handleFormChange}
                    className="font-bold text-lg"
                    placeholder="Item Name"
                  />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formState.category}
                      onChange={handleFormChange}
                      placeholder="Category"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formState.description}
                      onChange={handleFormChange}
                      placeholder="Item description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formState.price}
                      onChange={handleFormChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={formState.available}
                      onCheckedChange={checked => 
                        setFormState(prev => ({ ...prev, available: checked }))
                      }
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setEditingItem(null)}
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button onClick={handleSaveItem}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                </CardFooter>
              </>
            ) : (
              // View mode
              <>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.category}</CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Switch
                        id={`available-${item.id}`}
                        checked={item.available}
                        onCheckedChange={() => handleToggleAvailability(item.id)}
                      />
                      <Label htmlFor={`available-${item.id}`} className="ml-2 text-sm">
                        {item.available ? "Available" : "Unavailable"}
                      </Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-2">{item.description}</p>
                  <p className="font-semibold">R{item.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditItem(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No menu items found</h2>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? "No items match your search criteria" 
              : "Start by adding your first menu item"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsAddingItem(true)}>
              <PlusCircle className="h-4 w-4 mr-1" /> Add First Item
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
