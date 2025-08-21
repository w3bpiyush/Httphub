import React from "react";
import { useAuth } from "../../context/AuthContext";
import { View, Button, Text } from "react-native";

export default function Login() {
  const { login } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Page</Text>
      <Button title="Login" onPress={login} />
    </View>
  );
}
