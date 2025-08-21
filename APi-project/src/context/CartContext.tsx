import React, { createContext, useContext, useReducer } from 'react';
import type{ ReactNode } from 'react';
import type { CartItem, Product } from '../types/product';
import axios from 'axios';

interface CartState {
  cartItems: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Using DummyJSON's cart API
const API_URL = 'https://dummyjson.com/carts/add';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cartItems: []
      };

    case 'SET_CART':
      return {
        ...state,
        cartItems: action.payload
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });

  const addToCart = async (product: Product) => {
    try {
      // First update UI immediately for better UX
      dispatch({ type: 'ADD_TO_CART', payload: product });
      
      // Then send request to server with the correct format
      const response = await axios.post(API_URL, {
        userId: 1, // DummyJSON requires a userId
        products: [
          {
            id: product.id,
            quantity: 1,
            // DummyJSON might expect these additional fields
            title: product.title,
            price: product.price,
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Server response for add to cart:', response.data);
      
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      
      // Revert local state on error
      dispatch({ type: 'REMOVE_FROM_CART', payload: product.id });
      
      // Provide more specific error message
      if (error.response) {
        console.error('Server responded with:', error.response.status, error.response.data);
        throw new Error(`Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        throw new Error('Network error: Could not connect to the server');
      }
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      // First update UI immediately
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
      
      // For remove operations, we might need to use a different endpoint
      // DummyJSON doesn't have a direct remove endpoint, so we'll update the entire cart
      const response = await axios.post(API_URL, {
        userId: 1,
        products: state.cartItems
          .filter(item => item.id !== id)
          .map(item => ({
            id: item.id,
            quantity: item.quantity,
            title: item.title,
            price: item.price,
          }))
      });

      console.log('Server response for remove from cart:', response.data);
      
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      // First update UI immediately
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      
      // Update the entire cart on the server
      const response = await axios.post(API_URL, {
        userId: 1,
        products: state.cartItems.map(item => ({
          id: item.id,
          quantity: item.id === id ? quantity : item.quantity,
          title: item.title,
          price: item.price,
        }))
      });

      console.log('Server response for update quantity:', response.data);
      
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      throw new Error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      // First update UI immediately
      dispatch({ type: 'CLEAR_CART' });
      
      // Send empty cart to server
      const response = await axios.post(API_URL, {
        userId: 1,
        products: []
      });

      console.log('Server response for clear cart:', response.data);
      
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      throw new Error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return state.cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}