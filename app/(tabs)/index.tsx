import { useFetch } from "@/api/fetchData";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

export default function App() {
  const router = useRouter();
  const { data, loading, error } = useFetch<Product[]>(
    "https://fakestoreapi.com/products",
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => router.push(`/movies/${item.id}`)}
      className="bg-primary rounded-lg p-3 mb-3 shadow-sm flex-1"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-40 rounded-lg mb-2"
        resizeMode="contain"
      />
      <Text className="text-xl font-semibold text-gray-800 line-clamp-2">
        {item.title}
      </Text>
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-lg font-bold text-green-600">${item.price}</Text>
        <Text className="text-xs bg-gray-200 px-2 py-1 rounded">
          ⭐ {item.rating.rate}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <View className="flex-1 px-5">
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        <View className="mb-3">
          <SearchBar
            placeholder="Search For Movie"
            onPress={() => {
              router.push("/(tabs)/search");
            }}
          />
        </View>

        {loading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        {error && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-center text-base">
              Error: {error}
            </Text>
          </View>
        )}

        {!loading && !error && data && (
          <FlatList
            data={data}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-around" }}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
