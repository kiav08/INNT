import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../FirebaseConfig"; // Import auth from firebaseConfig

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null); // State for user

  // Separate states for login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Separate states for create account fields
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");

  // State for user's books
  const [books, setBooks] = useState([]);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserBooks(currentUser.uid);
      }
    });
    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Fetch the user's books from Firebase Realtime Database
  const fetchUserBooks = (userId) => {
    const db = getDatabase();
    const booksRef = ref(db, "Books");
    onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Filter books by sellerId (current user ID)
          const booksList = Object.entries(data)
            .map(([key, value]) => ({
              id: key,
              ...value,
            }))
            .filter((book) => book.sellerId === userId); // Filter books for the current user

          setBooks(booksList);
        }
      },
      (error) => {
        console.error("Error fetching books:", error);
      }
    );
  };

  // Handle login
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        const loggedInUser = userCredential.user;
        console.log("Logged in as:", loggedInUser.email);
        Alert.alert("Success", "Logged in successfully!");
      })
      .catch((error) => {
        console.error("Login error:", error);
        Alert.alert("Error", error.message);
      });
  };

  // Handle account creation
  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, createEmail, createPassword)
      .then((userCredential) => {
        const newUser = userCredential.user;
        console.log("Account created for:", newUser.email);
        Alert.alert("Success", "Account created successfully!");
      })
      .catch((error) => {
        console.error("Account creation error:", error);
        Alert.alert("Error", error.message);
      });
  };

  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Success", "You have logged out successfully!");
        setUser(null); // Clear the user state after logout
      })
      .catch((error) => {
        console.error("Logout error:", error);
        Alert.alert("Error", error.message);
      });
  };

  // Handle selecting a book and navigating to BookDetails
  const handleSelectBook = (book) => {
    navigation.navigate("EditBookDetails", { book }); // Pass book details to EditBookDetails screen
  };

  // If user is logged in, show their books, add book button, and logout button
  if (user) {
    return (
      <View style={{ marginBottom: 10, alignItems: "center", marginTop: 50 }}>
        <Text style={[styles.text, styles.welcomeText]}>
          Welcome, {user.email}
        </Text>

        <Text style={styles.text}>Dine bøger:</Text>

        {/* Add a new book button */}
        <TouchableOpacity
          style={styles.AddNewBook}
          onPress={() => navigation.navigate("AddBook")} // Navigate to AddBook screen
        >
          <Text style={styles.AddNewBookText}>Add a new book</Text>
        </TouchableOpacity>

        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookItem}
              onPress={() => handleSelectBook(item)} // Navigate to BookDetails screen
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Go to chats*/}
        <TouchableOpacity
          style={styles.AddNewBook}
          onPress={() => navigation.navigate("Chat")} // Navigate to Chat screen
        >
          <Text style={styles.AddNewBookText}>Gå til dine chats</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If user is not logged in, show login and create account forms
  return (
    <View style={{ marginBottom: 10, alignItems: "center", marginTop: 50 }}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={loginEmail}
        onChangeText={setLoginEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.text}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={createEmail}
        onChangeText={setCreateEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={createPassword}
        onChangeText={setCreatePassword}
        secureTextEntry
      />
      <Button title="Create Account" onPress={handleCreateAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    marginBottom: 10,
  },
  welcomeText: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginBottom: 10,
    paddingLeft: 8,
  },
  bookItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  AddNewBook: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  AddNewBookText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
