import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
  Alert,
  View,
  Text,
} from "react-native";
import { getDatabase, ref, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

export default function AddBook() {
  const db = getDatabase();
  const navigation = useNavigation();

  // Set the custom back button to go back to the Profile screen
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          title="Back"
          onPress={() => navigation.navigate("Profile")}
        />
      ),
    });
  }, [navigation]);

  // Initial state for book details
  const initialState = {
    title: "",
    author: "",
    year: "",
    subject: "",
  };

  // State for book details
  const [NewBook, setNewBook] = useState(initialState);

  // Function to handle input changes
  const changeTextInput = (name, event) => {
    setNewBook({ ...NewBook, [name]: event });
  };

  // Function to handle saving of book details
  const handleSave = async () => {
    const { title, author, year, subject } = NewBook;

    // Check if all fields are filled
    if (
      title.length === 0 ||
      author.length === 0 ||
      year.length === 0 ||
      subject.length === 0
    ) {
      return Alert.alert("Error", "All fields must be filled.");
    }

    const booksRef = ref(db, "Books/");
    await push(booksRef, NewBook)
      .then(() => {
        Alert.alert("Success", "Book was added successfully!");
        setNewBook(initialState); // Reset form
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.keys(initialState).map((key, index) => {
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.label}>{key}</Text>
              <TextInput
                value={NewBook[key]}
                onChangeText={(event) => changeTextInput(key, event)}
                style={styles.input}
                placeholder={`Enter ${key}`}
              />
            </View>
          );
        })}
        <Button title={"Add book"} onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
  },
});
