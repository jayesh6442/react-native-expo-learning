import { useFetch } from "@/api/fetchData";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

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

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const { data, loading, error } = useFetch<Product[]>(
        "https://fakestoreapi.com/products",
    );

    // Filter products based on search query
    const filteredProducts = useMemo(() => {
        if (!data) return [];
        if (!searchQuery.trim()) return data;

        return data.filter(
            (product) =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [data, searchQuery]);

    const renderProductItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            onPress={() => router.push(`/movies/${item.id}`)}
            className="flex-row bg-white rounded-lg p-3 mb-3 shadow-sm items-center"
        >
            <Image
                source={{ uri: item.image }}
                className="w-16 h-16 rounded-lg mr-3"
                resizeMode="contain"
            />
            <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                </Text>
                <View className="flex-row justify-between items-center mt-1">
                    <Text className="text-base font-bold text-green-600">
                        ${item.price}
                    </Text>
                    <Text className="text-xs bg-gray-200 px-2 py-1 rounded">
                        ⭐ {item.rating.rate}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <View className="flex-1 px-5 pt-4">
                {/* Search Bar */}
                <TextInput
                    placeholder="Search products..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="bg-white rounded-lg px-4 py-3 mb-4 text-base"
                />

                {/* Loading State */}
                {loading && (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#ffffff" />
                    </View>
                )}

                {/* Error State */}
                {error && (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-white text-center text-base">
                            Error: {error}
                        </Text>
                    </View>
                )}

                {/* Results */}
                {!loading && !error && (
                    <>
                        <Text className="text-white text-sm mb-3">
                            {filteredProducts.length} result
                            {filteredProducts.length !== 1 ? "s" : ""} found
                        </Text>

                        {filteredProducts.length > 0 ? (
                            <FlatList
                                data={filteredProducts}
                                renderItem={renderProductItem}
                                keyExtractor={(item) => item.id.toString()}
                                scrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-gray-400 text-lg">No products found</Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Search;
