import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import BookList from "./screens/BookList";
import BookDetails from "./screens/BookDetails";
import AddBook from "./screens/AddBook";
import Profile from "./screens/Profile";
import EditBookDetails from "./screens/EditBookDetails";
import Chat from "./screens/Chat";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack for the "Find Books" section
const FindBooksStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BookList" component={BookList} />
      <Stack.Screen name="BookDetails" component={BookDetails} />
    </Stack.Navigator>
  );
};

// Stack for the "Profile" section
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="AddBook" component={AddBook} />
      <Stack.Screen name="EditBookDetails" component={EditBookDetails} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const BottomNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Find bøger"
        component={FindBooksStack}
        options={{
          tabBarIcon: () => <Ionicons name="book" size={20} />,
          headerShown: false, // Hide header for tab screens
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{
          tabBarIcon: () => <Ionicons name="person" size={20} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <BottomNavigation />
    </NavigationContainer>
  );
}
