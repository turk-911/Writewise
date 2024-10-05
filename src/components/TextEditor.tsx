import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextEditorProps } from "../utils/types";
const TextEditor: React.FC<TextEditorProps> = ({
  noteId,
  placeholder,
  theme,
}) => {
  const editorRef = useRef<RichEditor>(null);
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    const loadNoteContent = async () => {
      try {
        const savedContent = await AsyncStorage.getItem(noteId);
        if (savedContent !== null) {
          setContent(savedContent);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load note content");
      }
    };
    loadNoteContent();
  }, [noteId]);
  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    try {
      await AsyncStorage.setItem(noteId, newContent);
    } catch (error) {
      Alert.alert("Error", "Failed to save note content");
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <RichEditor
        ref={editorRef}
        initialContentHTML={content}
        placeholder={placeholder}
        editorStyle={{
          backgroundColor: theme.backgroundColor,
          color: theme.inputTextColor,
          contentCSSText: `font-size: 18px; padding: 10px; border-radius: 5px;`,
        }}
        onChange={handleContentChange}
        style={styles.richEditor}
      />
      <RichToolbar
        editor={editorRef}
        style={[styles.toolbar, { backgroundColor: theme.backgroundColor }]}
        iconTint={theme.inputTextColor}
        selectedIconTint={theme.buttonColor}
        actions={[
          "bold",
          "italic",
          "underline",
          "bulletList",
          "orderedList",
          "image",
        ]}
        iconMap={{
          bold: () => (
            <Ionicons name="logo-bitcoin" size={24} color={theme.inputTextColor} />
          ),
          italic: () => (
            <Ionicons name="logo-codepen" size={24} color={theme.inputTextColor} />
          ),
          underline: () => (
            <Ionicons
              name="logo-usd"
              size={24}
              color={theme.inputTextColor}
            />
          ),
          bulletList: () => (
            <Ionicons name="list" size={24} color={theme.inputTextColor} />
          ),
          orderedList: () => (
            <Ionicons
              name="list-outline"
              size={24}
              color={theme.inputTextColor}
            />
          ),
          image: () => (
            <Ionicons
              name="image-outline"
              size={24}
              color={theme.inputTextColor}
            />
          ),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  richEditor: {
    minHeight: 150,
    borderRadius: 5,
    padding: 10,
  },
  toolbar: {
    height: 50,
  },
});

export default TextEditor;
