import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const navigation = useNavigation();

  return (
    <View style={{ marginBottom: 10, alignItems: "center", marginTop: 50 }}>
      <Text style={styles.text}>Dette er Profilsiden</Text>

      {/* Button to navigate to the AddBook screen */}
      <Button
        title="Add a New Book"
        onPress={() => navigation.navigate("AddBook")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
  },
});
