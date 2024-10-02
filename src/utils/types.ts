import { StackScreenProps } from "@react-navigation/stack";
export type Note = {
    title: string;
    content: string;
    coverImage: string;
    emoji: string;
};
export type RootStackParamList = {
    Home: undefined;
    Note: { note?: Note };
};
export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type NoteScreenProps = StackScreenProps<RootStackParamList, 'Note'>;