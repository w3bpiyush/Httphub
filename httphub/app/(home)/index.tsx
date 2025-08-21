import { View, Text, Button } from "react-native";
import { useAuth } from "../../context/AuthContext";
import React from "react";

export default function HomeScreen() {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome Home!</Text>
      <Button title="Log Out" onPress={logout} />
    </View>
  );
}
