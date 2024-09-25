import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";


export default function BookList({ navigation }) {
    // State for books
    const [books, setBooks] = useState(null);
  
    // useEffect for fetching data from Firebase
    useEffect(() => {
      const db = getDatabase();
      const booksRef = ref(db, "Books");
  
      // Listen for changes in the "books" node with onValue
      const unsubscribe = onValue(
        booksRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            console.log("Data received from Firebase: ", data);
  
            // Convert the object returned by Firebase into an array of book objects
            const booksList = Object.entries(data).map(([key, value]) => ({
              id: key,
              ...value,
            }));
            setBooks(booksList); // Store array in state
          } else {
            console.log("No books found");
          }
        },
        (error) => {
          console.error("Error fetching data: ", error);
        }
      );
  
      // Clean up function
      return () => unsubscribe();
    }, []);
  
    // Show message if no books are found
    if (!books) {
      return <Text>No books found</Text>;
    }
  
    // Function to handle selecting a book
    const handleSelectBook = (id) => {
      const selectedBook = books.find((book) => book.id === id);
      if (selectedBook) {
        console.log("Selected book: ", selectedBook);
        navigation.navigate("BookDetails", { book: selectedBook }); // Navigate to BookDetails screen with selected book
      } else {
        console.error("Book with ID " + id + " not found"); // Handle error if book not found
      }
    };
  
    // Render each book in the FlatList
    return (
      <FlatList
        data={books} // Data array for FlatList
        keyExtractor={(item) => item.id} // Use book ID as the key
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.container}
            onPress={() => handleSelectBook(item.id)}
          >
            <Text>
              {item.author}, {item.title} ({item.year})
            </Text>
          </TouchableOpacity>
        )}
      />
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
  });