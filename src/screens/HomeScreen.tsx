import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Note, HomeScreenProps } from "../utils/types";
import { useIsFocused } from "@react-navigation/native";
import { Appearance } from "react-native-appearance";
import { darkTheme, lightTheme } from "../utils/theme";
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [notes, setNotes] = useState<Array<Note>>([]);
  const isFocused = useIsFocused();
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme
  );
  useEffect(() => {
    if (isFocused) loadNotes();
  }, [isFocused]);
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    });
    return () => listener.remove();
  }, []);
  async function loadNotes() {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Button
        title="Add Note"
        onPress={() => navigation.navigate("Note", { note: undefined })}
      />
      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Note", { note: item })}
          >
            <Text style={{ padding: 10, fontSize: 18 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
