import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import React from "react";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect href="/(home)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
