import React, { useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Chat() {
  const navigation = useNavigation();

  // Set up custom back button behavior
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button title="Back" onPress={() => navigation.navigate("Profile")} />
      ),
    });
  }, [navigation]);

  return (
    <View style={{ marginBottom: 10, alignItems: "center", marginTop: 50 }}>
      <Text style={styles.text}>Dette er dine chats</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
  },
});
