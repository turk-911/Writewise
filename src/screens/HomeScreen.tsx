import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
type Note = {
    title: string;
    content: string;
}
type RootStackParamList = {
    Home: undefined;
    Note: { note?: Note };
}
type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
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
        <View>
            <Button title="Add Note" onPress={() => navigation.navigate('Note')} />
            <FlatList data={notes} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate('Note', { note: item })}>
                    <Text>{item.title}</Text>
                </TouchableOpacity>
            )} />
        </View>
    )
}