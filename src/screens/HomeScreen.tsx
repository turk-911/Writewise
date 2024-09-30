import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Note, HomeScreenProps } from "../utils/types";
export default function HomeScreen({ navigation }: HomeScreenProps) {
    const [notes, setNotes] = useState<Array<Note>>([]);
    useEffect(() => {
        loadNotes();
    }, []);
    async function loadNotes() {
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            if(storedNotes) setNotes(JSON.parse(storedNotes));
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <View style={{flex: 1, padding: 20}}> 
            <Button title="Add Note" onPress={() => navigation.navigate('Note', { note: undefined })} />
            <FlatList data={notes} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Note', { note: item })}>
                    <Text style={{padding: 10, fontSize: 18}}>{item.title}</Text>
                </TouchableOpacity>
            )} />
        </View>
    )
}