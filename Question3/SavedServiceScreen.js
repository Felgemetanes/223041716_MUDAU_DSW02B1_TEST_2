import React from "react";
import { View, Text } from "react-native";
import { useApp } from "./AppContext";

export default function SavedServicesScreen() {
  const { savedServices } = useApp();

  if (savedServices.length === 0) {
    return <Text>No saved services yet</Text>; // 3.3 empty-state message
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {savedServices.map(s => (
        <Text key={s.id}>{s.name}</Text>
      ))}
    </View>
  );
}
