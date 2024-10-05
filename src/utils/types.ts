import { StackScreenProps } from "@react-navigation/stack";
import { ReactNode } from "react";
export type Note = {
    title: string;
    content: string;
    noteId: string;
    coverImage?: string | null; 
    emoji: string;
    voiceNote?: string | null; 
};
export type RootStackParamList = {
    Home: undefined;
    Note: { note?: Note };
};
export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type NoteScreenProps = StackScreenProps<RootStackParamList, 'Note'>;
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
