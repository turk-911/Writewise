import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Note, HomeScreenProps } from "../utils/types";
import { useIsFocused } from "@react-navigation/native";
import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "../utils/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const deleteNote = async (noteId: string) => {
    const filteredNotes = notes.filter((note) => note.noteId !== noteId);
    setNotes(filteredNotes);
    await AsyncStorage.setItem("notes", JSON.stringify(filteredNotes));
  };

  const renderRightActions = (item: Note) => {
    return (
      <Pressable
        onPress={() => deleteNote(item.noteId)} // Use noteId for deletion
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    );
  };

  async function loadNotes() {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <FlatList
          data={notes}
          keyExtractor={(item) => item.noteId} 
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <Pressable
                onPress={() => {
                  if (item.locked) {
                    navigation.navigate("PasswordEntry", { note: item });
                  } else {
                    navigation.navigate("Note", { note: item, noteId: item.noteId });
                  }
                }}
                style={[
                  styles.noteContainer,
                  { backgroundColor: theme.backgroundColor },
                ]}
              >
                <Text style={[styles.emoji, { color: theme.textColor }]}>
                  {item.emoji}
                </Text>
                <Text style={[styles.title, { color: theme.textColor }]}>
                  {item.title}
                </Text>
                {item.locked && (
                  <MaterialIcons
                    name="lock"
                    size={24}
                    color="grey"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </Pressable>
            </Swipeable>
          )}
        />
      </View>
      <Pressable
        style={styles.addButton}
        onPress={() => {
          const newNote = {
            title: "",
            content: "",
            noteId: Math.random().toString(36).substr(2, 9), // Generate unique noteId
            coverImage: null,
            emoji: "📝",
            voiceNote: null,
            locked: false,
          };
          navigation.navigate("Note", { note: newNote, noteId: newNote.noteId });
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  emoji: {
    fontSize: 32,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 5,
    marginVertical: 5,
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#2196F3",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    color: "white",
    fontSize: 28,
  },
});
