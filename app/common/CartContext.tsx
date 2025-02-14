import React, { createContext, useState, ReactNode } from 'react';

// Define context type
interface CartContextType {
    cartItems: string[];
    setCartItems: React.Dispatch<React.SetStateAction<string[]>>;
    totalCartValue: number;
    setTotalCartValue: React.Dispatch<React.SetStateAction<number>>;
    isModalVisible: boolean;  // Add isModalVisible to the context
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;  // Add setModalVisible to the context
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<string[]>([]);
    const [totalCartValue, setTotalCartValue] = useState<number>(0);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);  // Modal visibility state

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            setCartItems, 
            totalCartValue, 
            setTotalCartValue, 
            isModalVisible, 
            setModalVisible 
        }}>
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
