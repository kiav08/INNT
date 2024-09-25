import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert, Platform } from "react-native";

export default function BookDetails({ navigation, route }) {
  // set up state for book
  const [book, setBook] = useState(null);

  // useEffect to set book state
  useEffect(() => {
    setBook(route.params.book);

    // return function to clean up
    return () => {
      setBook({});
    };
  }, []);

// cleanup function
  if (!book) {
    return <Text>No data</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Shows book details */}
      {Object.entries(book).map((item, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.label}>{item[0]}: </Text>
          <Text style={styles.value}>{item[1]}</Text>
        </View>
      ))}

      {/* Buttons to buy or bid */}
      <View style={styles.row}>
        <Button title="Byd" />
        <Button title="Køb" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
  },
  value: {
    color: "gray",
  },
});
