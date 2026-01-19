import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    rating: {
        rate: number;
        count: number;
    };
}

interface SavedContextType {
    savedItems: Product[];
    addToSaved: (product: Product) => void;
    removeFromSaved: (productId: number) => void;
    isSaved: (productId: number) => boolean;
    loading: boolean;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

const STORAGE_KEY = "@saved_products";

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [savedItems, setSavedItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Load saved items from AsyncStorage
    useEffect(() => {
        const loadSavedItems = async () => {
            try {
                const data = await AsyncStorage.getItem(STORAGE_KEY);
                if (data) {
                    setSavedItems(JSON.parse(data));
                }
            } catch (error) {
                console.error("Error loading saved items:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSavedItems();
    }, []);

    // Save to AsyncStorage whenever savedItems changes
    useEffect(() => {
        if (!loading) {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems)).catch(
                (error) => console.error("Error saving items:", error),
            );
        }
    }, [savedItems, loading]);

    const addToSaved = (product: Product) => {
        setSavedItems((prevItems) => {
            if (!prevItems.find((item) => item.id === product.id)) {
                return [...prevItems, product];
            }
            return prevItems;
        });
    };

    const removeFromSaved = (productId: number) => {
        setSavedItems((prevItems) =>
            prevItems.filter((item) => item.id !== productId),
        );
    };

    const isSaved = (productId: number) => {
        return savedItems.some((item) => item.id === productId);
    };

    return (
        <SavedContext.Provider
            value={{ savedItems, addToSaved, removeFromSaved, isSaved, loading }}
        >
            {children}
        </SavedContext.Provider>
    );
};

export const useSaved = () => {
    const context = useContext(SavedContext);
    if (!context) {
        throw new Error("useSaved must be used within SavedProvider");
    }
    return context;
};
