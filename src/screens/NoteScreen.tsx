import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  Alert,
  Button,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Note, NoteScreenProps } from "../utils/types";
import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "../utils/theme";
import * as ImagePicker from "expo-image-picker";
import EmojiPicker from "../modals/EmojiPicker";
import TextEditor from "../components/TextEditor";

export default function NoteScreen({ route, navigation }: NoteScreenProps) {
  const { noteId, note } = route.params;
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [emoji, setEmoji] = useState(note ? note.emoji : "😊");
  const [coverImage, setCoverImage] = useState<string | null>(
    note?.coverImage ||
      "https://unsplash.com/photos/3d-geometric-texture-in-copper-jz4D4prCXSM"
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  // Code for selecting cover image
  const promptImageSelection = () => {
    Alert.alert("Select image", "Choose an option to select your cover image", [
      { text: "Cancel", style: "cancel" },
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: selectImage },
    ]);
  };
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
    else
      setCoverImage(
        "https://unsplash.com/photos/3d-geometric-texture-in-copper-jz4D4prCXSM"
      );
  };
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Camera permissions are required");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  };

  // Code for figuring out which mode to select
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme
  );
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
    });
    return () => listener.remove();
  }, []);

  // Code for selecting emoji
  const selectEmoji = (selectedEmoji: string) => {
    setEmoji(selectedEmoji);
    setShowEmojiPicker(false);
  };

  // Code for saving note
const saveNote = async () => {
  if (title.trim() === "" || content.trim() === "") {
    Alert.alert("Error", "Both title and content are required");
    return;
  }

  try {
    const storedNotes = await AsyncStorage.getItem("notes");
    const notes: Array<Note> = storedNotes ? JSON.parse(storedNotes) : [];

    // Generate a unique key using noteId or UUID fallback
    const noteKey = note?.id ? `note_${note.id}` : `note_${uuidv4()}`;

    if (note) {
      // Update existing note
      const updatedNotes = notes.map((n) =>
        n.id === note.id
          ? {
              ...n, // Keep existing note properties
              title,
              content,
              emoji,
              coverImage,
              locked: note.locked,
              password,
            }
          : n
      );
      await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    } else {
      // Create a new note
      const newNote = {
        id: noteKey, // Ensure the new note has a valid unique ID
        title,
        content,
        emoji,
        coverImage,
        locked: false,
        password,
      };
      await AsyncStorage.setItem("notes", JSON.stringify([...notes, newNote]));
    }

    navigation.navigate("Home");
  } catch (error) {
    Alert.alert("Error", "Failed to save note");
  }
};
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[styles.container, { backgroundColor: theme.backgroundColor }]}
        >
          {coverImage && (
            <Image source={{ uri: coverImage }} style={styles.coverImage} />
          )}
          <TouchableOpacity onPress={promptImageSelection}>
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
            value={password}
            onChangeText={setPassword}
            placeholder="Password (leave blank if not locked)"
            secureTextEntry={true}
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.inputTextColor,
              },
            ]}
          />
          <View style={styles.textArea}>
            <TextEditor
              noteId={noteId}
              placeholder="Write your content here..."
              theme={theme}
              onContentChange={(newContent) => setContent(newContent)}
            />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Button
              title="Save Note"
              onPress={saveNote}
              color={theme.buttonColor}
            />
          </View>
          <EmojiPicker
            isVisible={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
          >
            <Text style={styles.emojiOption} onPress={() => setEmoji("😊")}>
              😊
            </Text>
            <Text style={styles.emojiOption} onPress={() => setEmoji("😂")}>
              😂
            </Text>
            <Text style={styles.emojiOption} onPress={() => setEmoji("❤️")}>
              ❤️
            </Text>
          </EmojiPicker>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
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
    marginBottom: 40, // Added more margin to separate toolbar and button
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
