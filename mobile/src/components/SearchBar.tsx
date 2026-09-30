import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { styles } from "../styles/searchBar.styles";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Buscar quadra, modalidade ou centro"}
        placeholderTextColor="#6B7280"
        style={styles.input}
      />
      <Ionicons name="search" size={22} color="#2F7DBA" />
    </View>
  );
}