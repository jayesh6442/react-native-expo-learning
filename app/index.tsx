import { Link } from "expo-router";
import "./global.css"
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text
        className="
      font-bold
      text-4xl
      
      ">
        Welcome
      </Text>
      <Link href="/home/Home" >
        home</Link>
    </View>
  );
}