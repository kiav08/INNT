import * as React from "react";
import { StyleSheet } from "react-native";
import { getApps, initializeApp } from "firebase/app";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for icons

// Import components
import BookList from "./components/BookList";
import Profile from "./components/Profile";
import BookDetails from "./components/BookDetails";
import AddBook from "./components/AddBook";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5q2uzhMmKzoNZw6QjEd1Wiof3dfBt_ps",
  authDomain: "my-app-4-88614.firebaseapp.com",
  databaseURL:
    "https://my-app-4-88614-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-app-4-88614",
  storageBucket: "my-app-4-88614.appspot.com",
  messagingSenderId: "690679301727",
  appId: "1:690679301727:web:c78007959fa72f8c6f3dea",
};

// Firebase initialization
if (getApps().length < 1) {
  initializeApp(firebaseConfig);
  console.log("Firebase On!");
}

// Initialize Stack and Tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for BookList, BookDetails, and AddBook
const StackNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BookList"
        component={BookList}
        options={{ title: "Book List" }}
      />
      <Stack.Screen
        name="BookDetails" // Brug "BookDetails" uden mellemrum konsekvent
        component={BookDetails}
        options={{ title: "Book Details" }}
      />
      <Stack.Screen
        name="AddBook"
        component={AddBook}
        options={{ title: "Add Book" }}
      />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const BottomNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Find books"
          component={StackNavigation}
          options={{
            tabBarIcon: () => <Ionicons name="book" size={20} />,
            headerShown: false, // Hides header for this tab
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: () => <Ionicons name="person" size={20} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return <BottomNavigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
