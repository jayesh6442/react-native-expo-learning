import { useSaved } from "@/context/SavedContext";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
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

const Saved = () => {
  const { savedItems, removeFromSaved } = useSaved();
  const router = useRouter();

  const renderProductItem = ({ item }: { item: Product }) => (
    <View className="flex-row bg-white rounded-lg p-3 mb-3 shadow-sm items-center">
      <TouchableOpacity
        onPress={() => router.push(`/movies/${item.id}`)}
        className="flex-1 flex-row items-center"
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
      <TouchableOpacity
        onPress={() => removeFromSaved(item.id)}
        className="ml-2 bg-red-600 rounded-lg p-2"
      >
        <Text className="text-white text-lg">❌</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-white text-2xl font-bold mb-4">Saved Items</Text>

        {savedItems.length > 0 ? (
          <>
            <Text className="text-gray-400 text-sm mb-3">
              {savedItems.length} item{savedItems.length !== 1 ? "s" : ""}
            </Text>
            <FlatList
              data={savedItems}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400 text-lg text-center">
              No saved items yet
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center">
              Tap the heart icon to save your favorite products
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Saved;
