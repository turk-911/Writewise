import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { NoteScreenProps } from "../utils/types";

export default function NoteScreen({ route, navigation }: NoteScreenProps) {
    const { note } = route.params;
    const [title, setTitle] = useState(note ? note.title : "");
    const [content, setContent] = useState(note ? note.content : "");
    const saveNote = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            const notes = storedNotes ? JSON.parse(storedNotes) : [];
            if(note) {
                const updatedNotes = notes.map((n: { title: any; }) => n.title === note.title ? { title, content }: n);
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
            } else {
                notes.push({ title, content });
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save note');
        }
    }
    return (
        <View style={{flex: 1, padding: 20 }}>
            <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={{fontSize: 24, marginBottom: 10}}/>
            <TextInput value={content} onChangeText={setContent} placeholder="Content" multiline style={{flex: 1, fontSize: 18}} />
            <Button title="Save Note" onPress={saveNote} />
        </View>
    )
}