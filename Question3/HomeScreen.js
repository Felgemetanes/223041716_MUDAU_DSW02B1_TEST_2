import React from "react";
import { View, Text, Button } from "react-native";
import { useApp } from "./AppContext";

export default function HomeScreen() {
  const { savedServices, preference, setPreference } = useApp();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Saved Services: {savedServices.length}</Text>
      <Text>Preference: {preference}</Text>
      <Button
        title="Toggle Preference"
        onPress={() => setPreference(preference === "Light" ? "Dark" : "Light")}
      />
    </View>
  );
}
