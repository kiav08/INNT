import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";

export default function BookList({ navigation }) {
  const [books, setBooks] = useState(null); // State for books
  const [filteredBooks, setFilteredBooks] = useState(null); // State for filtered books
  const [search, setSearch] = useState(""); // State for search query

  useEffect(() => {
    // Get a reference to the database
    const db = getDatabase();
    const booksRef = ref(db, "Books");

    // Fetch books data from Firebase
    const unsubscribe = onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log("Data received from Firebase: ", data);
          const booksList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setBooks(booksList);
          setFilteredBooks(booksList); // Initialize filteredBooks with the full book list
        } else {
          console.log("No books found");
        }
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );

    return () => unsubscribe(); // Cleanup function
  }, []);

  // Handle search input and filter the book list
  const handleSearch = (text) => {
    setSearch(text);

    // Filter books based on the search query (by title or author)
    if (books) {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(text.toLowerCase()) ||
          book.author.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  if (!filteredBooks) {
    return <Text>Ingen bøger fundet</Text>;
  }

  // Function to handle selecting a book
  const handleSelectBook = (id) => {
    const selectedBook = filteredBooks.find((book) => book.id === id);
    if (selectedBook) {
      navigation.navigate("BookDetails", { book: selectedBook }); // Navigate to BookDetails screen with selected book
    } else {
      console.error("Book with ID " + id + " not found");
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Søg efter titel eller forfatter"
        value={search}
        onChangeText={handleSearch} // Filter the list as user types
      />
      {/* FlatList to render filtered books */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookItem}
            onPress={() => handleSelectBook(item.id)}
          >
            <Text>
              {item.author}, {item.title} ({item.year})
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  bookItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
