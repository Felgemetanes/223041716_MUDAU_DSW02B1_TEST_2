import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, FlatList, Animated } from "react-native";

// 4.2 Immutable state handling

export default function AlertScreen() {
  const [saved, setSaved] = useState([]);

  function toggleSaved(id) {
    setSaved(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  }

  const alerts = [
    { id: "1", title: "Exam postponed" },
    { id: "2", title: "Library closed" },
    { id: "3", title: "New timetable" },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* 4.5 Saved-alert count */}
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        Saved Alerts: {saved.length}
      </Text>

      <FlatList
        data={alerts}
        // 4.3 Stable list identity
    
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <AlertCard
            item={item}
            saved={saved.includes(item.id)}
            toggleSaved={toggleSaved}
          />
        )}
      />
    </View>
  );
}


// 4.4 Animation lifecycle + 4.5 Extended interaction

function AlertCard({ item, saved, toggleSaved }) {
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fade,
        transform: [{ translateY }],
        padding: 10,
        marginBottom: 10,
        backgroundColor: saved ? "#d4edda" : "#f8d7da", // distinct styling
      }}
    >
      <Text style={{ fontWeight: "bold" }}>{item.title}</Text>

      {/* 4.1 Correct event handling */}
      <Pressable onPress={() => toggleSaved(item.id)}>
        <Text>{saved ? "Saved" : "Save"}</Text>
      </Pressable>
    </Animated.View>
  );
}
