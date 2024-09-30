# React Native Note-Taking App - Writewise

A simple note-taking app built with **React Native**, **Expo**, and **TypeScript**. The app allows users to create, view, and edit notes. It includes **dark mode** support based on the system theme and stores data persistently using **AsyncStorage**.

## Features

- **Add and Edit Notes**: Users can create new notes or edit existing ones.
- **Dark Mode**: The app adapts to the system-wide theme (dark/light mode).
- **Persistent Storage**: Notes are saved locally using `AsyncStorage` and are available even after the app is closed.
- **Keyboard Dismissal**: The keyboard dismisses when tapping outside of input fields.

## Tech Stack

- **React Native**: Framework for building native apps using React.
- **Expo**: A platform for developing and building React Native apps quickly.
- **TypeScript**: Typed JavaScript for better code quality and maintainability.
- **AsyncStorage**: Local storage solution for persisting data across app sessions.

## Installation

    Run the commands in the given order to make this project yours!

```bash
git clone https://github.com/turk-911/Writewise.git
cd Writewise
npm install
npx expo start
```

## Usage

1. **Add Note** : On the home screen, press “Add Note” to create a new note.
2. **Edit Note** : Tap on an existing note to edit it.
3. **Dark Mode** : The app automatically switches to dark mode if the system theme is set to dark.

## Contributions

* [ ] Feel free to submit a pull request or open an issue if you find a bug or want to propose new features.
