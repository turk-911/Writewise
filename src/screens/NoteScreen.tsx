import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Button, Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { Note, NoteScreenProps } from "../utils/types";
import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "../utils/theme";
export default function NoteScreen({ route, navigation }: NoteScreenProps) {
  const { note } = route.params;
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme
  );
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    });
    return () => listener.remove();
  });
  const saveNote = async () => {
    if (title.trim() === "" || content.trim() === "") {
      Alert.alert("Error", "Both title and content are required");
      return;
    }
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      const notes: Array<Note> = storedNotes ? JSON.parse(storedNotes) : [];
      if (note) {
        const updatedNotes = notes.map((n) =>
          n.title === note.title ? { title, content } : n
        );
        await AsyncStorage.setItem("notes", JSON.stringify(notes));
      } else {
        const newNote = { title, content };
        await AsyncStorage.setItem(
          "notes",
          JSON.stringify([...notes, newNote])
        );
      }
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "Failed to save note");
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundColor,
              color: theme.inputTextColor,
            },
          ]}
        />
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Content"
          multiline
          style={[
            styles.textArea,
            {
              backgroundColor: theme.backgroundColor,
              color: theme.inputTextColor,
            },
          ]}
        />
        <Button
          title="Save Note"
          onPress={saveNote}
          color={theme.buttonColor}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    fontSize: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  textArea: {
    fontSize: 18,
    height: 150,
    textAlignVertical: "top",
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
});
