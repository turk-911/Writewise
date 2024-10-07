import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { ReactNode } from "react";
export type Note = {
    title: string;
    content: string;
    noteId: string;
    coverImage?: string | null; 
    emoji: string;
    voiceNote?: string | null; 
    locked: boolean;
    password?: string;
    id?: any;
};
export type RootStackParamList = {
    Home: undefined;
    Note: { note?: Note, noteId: string };
    PasswordEntry: { note: Note }; 
};
export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type NoteScreenProps = StackScreenProps<RootStackParamList, 'Note'>;
export type PasswordEntryScreenNavigationProps = StackNavigationProp<RootStackParamList, 'PasswordEntry'>;
export type PasswordEntryRouteProp = RouteProp<RootStackParamList, 'PasswordEntry'>;
export interface EmojiPickerProps {
    isVisible: boolean;
    children: ReactNode;
    onClose: () => void;
};
export interface MenuProps {
    setLineColor: (color: string) => void;
    setLineWidth: (width: number) => void;
    setLineOpacity: (opacity: number) => void;
}
export interface TextEditorProps {
    noteId: string;
    onContentChange: (html: string) => void;
    placeholder: string;
    theme: any;
}
export interface PasswordEntryProps  {
    route: PasswordEntryRouteProp;
    navigation: PasswordEntryScreenNavigationProps;
}