import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Button, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Note, NoteScreenProps } from "../utils/types";
import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "../utils/theme";
import * as ImagePicker from "expo-image-picker";
import EmojiSelector from "react-native-emoji-selector";
import EmojiPicker from "../modals/EmojiPicker";
export default function NoteScreen({ route, navigation }: NoteScreenProps) {
  const { note } = route.params;
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [emoji, setEmoji] = useState(note ? note.emoji : "😊");
  const [coverImage, setCoverImage] = useState<string | null>(
    note
      ? note.coverImage
      : "https://unsplash.com/photos/3d-geometric-texture-in-copper-jz4D4prCXSM"
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if(!result.canceled) setCoverImage(result.assets[0].uri);
    else setCoverImage(
      "https://unsplash.com/photos/3d-geometric-texture-in-copper-jz4D4prCXSM"
    );
  }
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme
  );
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    });
    return () => listener.remove();
  }, []);
  const selectEmoji = (selectedEmoji: string) => {
    setEmoji(selectedEmoji);
    setShowEmojiPicker(false);
  }
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
          n.title === note.title ? { title, content, emoji, coverImage } : n
        );
        await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
      } else {
        const newNote = { title, content, emoji, coverImage };
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
        {coverImage && (
          <Image source={{ uri: coverImage }} style={styles.coverImage} />
        )}
        <TouchableOpacity onPress={selectImage}>
          <Text style={styles.addImageText}>Add Cover Image</Text>
        </TouchableOpacity>
        <View style={styles.emojiContainer}>
          <TouchableOpacity onPress={() => setShowEmojiPicker(true)}>
            <Text style={styles.emoji}>{emoji || "😊"}</Text>
          </TouchableOpacity>
        </View>
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
        <EmojiPicker
          isVisible={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
        >
          <Text
            style={styles.emojiOption}
            onPress={() => setEmoji("😊")}
          >
            😊
          </Text>
          <Text
            style={styles.emojiOption}
            onPress={() => setEmoji("😂")}
          >
            😂
          </Text>
          <Text
            style={styles.emojiOption}
            onPress={() => setEmoji("❤️")}
          >
            ❤️
          </Text>
        </EmojiPicker>
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
  coverImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  addImageText: {
    fontSize: 16,
    color: "#007aff",
    marginBottom: 20,
    textAlign: "center",
  },
  emojiContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40,
  },
  emojiOption: {
    fontSize: 40,
    padding: 10,
  },
});
