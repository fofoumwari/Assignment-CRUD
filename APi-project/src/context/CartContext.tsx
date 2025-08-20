import React, { createContext, useContext, useReducer } from 'react';
import type {ReactNode} from 'react';
import type { CartItem, Product } from '../types/product';
import axios from 'axios';

interface CartState {
  cartItems: CartItem[];
  cartId: number | null;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: { items: CartItem[]; cartId: number } };

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

// DummyJSON Cart API endpoints
const API_BASE = 'https://dummyjson.com/carts';
const USER_ID = 1; // You can get this from auth context

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
        cartItems: action.payload.items,
        cartId: action.payload.cartId
      };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { 
    cartItems: [], 
    cartId: null 
  });

  // Get or create user cart
  const getOrCreateCart = async (): Promise<number> => {
    if (state.cartId) return state.cartId;

    try {
      // Try to get user's existing cart
      const response = await axios.get(`${API_BASE}/user/${USER_ID}`);
      const userCarts = response.data.carts;
      
      if (userCarts && userCarts.length > 0) {
        const latestCart = userCarts[userCarts.length - 1];
        dispatch({ 
          type: 'SET_CART', 
          payload: { 
            items: latestCart.products, 
            cartId: latestCart.id 
          } 
        });
        return latestCart.id;
      }
    } catch (error) {
      console.log('No existing cart found, creating new one');
    }

    // Create new cart if none exists
    try {
      const response = await axios.post(`${API_BASE}/add`, {
        userId: USER_ID,
        products: []
      });
      
      dispatch({ 
        type: 'SET_CART', 
        payload: { 
          items: [], 
          cartId: response.data.id 
        } 
      });
      return response.data.id;
    } catch (error) {
      console.error('Failed to create cart:', error);
      throw error;
    }
  };

  const addToCart = async (product: Product) => {
    try {
      const cartId = await getOrCreateCart();
      
      // Update server first
      const response = await axios.put(`${API_BASE}/${cartId}`, {
        merge: false, // Set to true if you want to merge quantities
        products: [
          ...state.cartItems,
          { id: product.id, quantity: 1 }
        ]
      });

      // Then update local state
      dispatch({ type: 'ADD_TO_CART', payload: product });
      
      console.log('Server response for add to cart:', response.data);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (id: number) => {
    try {
      if (!state.cartId) return;
      
      // Update server first
      const updatedProducts = state.cartItems
        .filter(item => item.id !== id)
        .map(item => ({ id: item.id, quantity: item.quantity }));
      
      const response = await axios.put(`${API_BASE}/${state.cartId}`, {
        products: updatedProducts
      });

      // Then update local state
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
      
      console.log('Server response for remove from cart:', response.data);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      if (!state.cartId) return;
      
      // Update server first
      const updatedProducts = state.cartItems.map(item =>
        item.id === id
          ? { id: item.id, quantity: quantity }
          : { id: item.id, quantity: item.quantity }
      );
      
      const response = await axios.put(`${API_BASE}/${state.cartId}`, {
        products: updatedProducts
      });

      // Then update local state
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      
      console.log('Server response for update quantity:', response.data);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (!state.cartId) return;
      
      // Update server first
      const response = await axios.put(`${API_BASE}/${state.cartId}`, {
        products: []
      });

      // Then update local state
      dispatch({ type: 'CLEAR_CART' });
      
      console.log('Server response for clear cart:', response.data);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const getCartTotal = () => {
    return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return state.cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Load user cart on initial render
  React.useEffect(() => {
    const loadUserCart = async () => {
      try {
        const response = await axios.get(`${API_BASE}/user/${USER_ID}`);
        const userCarts = response.data.carts;
        
        if (userCarts && userCarts.length > 0) {
          const latestCart = userCarts[userCarts.length - 1];
          dispatch({ 
            type: 'SET_CART', 
            payload: { 
              items: latestCart.products, 
              cartId: latestCart.id 
            } 
          });
        }
      } catch (error) {
        console.log('No existing cart found');
      }
    };

    loadUserCart();
  }, []);

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