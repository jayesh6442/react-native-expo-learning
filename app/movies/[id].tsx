import { useFetch } from "@/api/fetchData";
import { useAlert } from "@/context/AlertContext";
import { useSaved } from "@/context/SavedContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const MovieDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToSaved, removeFromSaved, isSaved } = useSaved();
  const { show: showAlert } = useAlert();

  // Convert id to string to ensure proper API call
  const productId = Array.isArray(id) ? id[0] : id;

  const { data, loading, error } = useFetch<Product>(
    `https://fakestoreapi.com/products/${productId}`,
  );

  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (data) {
      setSaved(isSaved(data.id));
    }
  }, [data, isSaved]);

  const handleSaveToggle = () => {
    if (!data) return;

    if (saved) {
      removeFromSaved(data.id);
      setSaved(false);
      showAlert({
        type: "success",
        title: "Removed",
        message: "Product removed from saved items",
      });
    } else {
      addToSaved(data);
      setSaved(true);
      showAlert({
        type: "success",
        title: "Saved",
        message: "Product saved successfully",
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white text-center text-base">Error: {error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white">No product found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="
    flex-1 bg-primary"
    >
      <View className="flex-1 bg-primary">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Product Image */}
          <View className="px-5 py-4">
            <View className="bg-white rounded-xl p-4 items-center">
              <Image
                source={{ uri: data.image }}
                className="w-full h-64"
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Product Info */}
          <View className="px-5">
            {/* Category */}
            <Text className="text-gray-400 text-sm capitalize mb-2">
              {data.category}
            </Text>

            {/* Title */}
            <Text className="text-white text-2xl font-bold mb-3">
              {data.title}
            </Text>

            {/* Rating */}
            <View className="flex-row items-center mb-4">
              <Text className="text-yellow-400 text-lg">
                ⭐ {data.rating.rate}
              </Text>
              <Text className="text-gray-400 text-sm ml-2">
                ({data.rating.count} reviews)
              </Text>
            </View>

            {/* Price */}
            <View className="bg-green-600 rounded-lg p-3 mb-4">
              <Text className="text-white text-sm">Price</Text>
              <Text className="text-white text-3xl font-bold">
                ${data.price.toFixed(2)}
              </Text>
            </View>

            {/* Description */}
            <Text className="text-white text-base font-semibold mb-2">
              Description
            </Text>
            <Text className="text-gray-300 text-base leading-6 mb-4">
              {data.description}
            </Text>

            {/* Add to Cart Button */}
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-blue-600 rounded-lg py-3 items-center">
                <Text className="text-white text-lg font-bold">
                  Add to Cart
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveToggle}
                className={`flex-1 rounded-lg py-3 items-center ${
                  saved ? "bg-red-600" : "bg-gray-600"
                }`}
              >
                <Text className="text-white text-lg font-bold">
                  {saved ? "❤️ Saved" : "🤍 Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MovieDetail;
