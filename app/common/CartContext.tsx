import React, { createContext, useState, ReactNode } from 'react';

// Define context type
interface CartContextType {
    cartItems: string[];
    setCartItems: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<string[]>([]);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the CartContext
const useCart = (): CartContextType => {
    const context = React.useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export { CartProvider, useCart };
