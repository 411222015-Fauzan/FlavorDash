import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: any) => void;
  updateQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Mengambil data keranjang dari SecureStore saat inisialisasi aplikasi
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await SecureStore.getItemAsync("cart");
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Gagal memuat keranjang belanja dari SecureStore:", error);
      }
    };
    loadCart();
  }, []);

  // Menyimpan data keranjang ke SecureStore setiap terjadi perubahan
  const saveCart = async (newItems: CartItem[]) => {
    try {
      await SecureStore.setItemAsync("cart", JSON.stringify(newItems));
    } catch (error) {
      console.error("Gagal menyimpan keranjang belanja ke SecureStore:", error);
    }
  };

  const addToCart = (item: any) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      let newItems: CartItem[];
      
      // Parse harga string menjadi angka (misal "Rp 25.000" -> 25000)
      const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""), 10);

      if (existingItem) {
        newItems = prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [
          ...prevItems,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            priceNum: priceNum,
            image: item.image,
            category: item.category,
            quantity: 1,
          },
        ];
      }
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (id: string, amount: number) => {
    setCartItems((prevItems) => {
      const newItems = prevItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return context;
}
