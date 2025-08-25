import React from 'react'
import { Stack } from 'expo-router'

export default function EditProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Edit Profile' }} />
    </Stack>
  )
} 