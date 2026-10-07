import React from "react";
import { View, Text, Button } from "react-native";
import { useApp } from "./AppContext";

const services = [
  { id: "1", name: "Library Support" },
  { id: "2", name: "ICT Helpdesk" },
  { id: "3", name: "Career Services" },
];

export default function ServicesScreen() {
  const { addSavedService, removeSavedService, savedServices } = useApp();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {services.map(s => {
        const isSaved = savedServices.find(x => x.id === s.id);
        return (
          <View key={s.id} style={{ marginBottom: 10 }}>
            <Text>{s.name}</Text>
            {isSaved ? (
              <Button title="Remove" onPress={() => removeSavedService(s.id)} />
            ) : (
              <Button title="Save" onPress={() => addSavedService(s)} />
            )}
          </View>
        );
      })}
    </View>
  );
}
