import React from 'react'
import { Stack } from 'expo-router'

export default function CollectionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Collections' }} />
    </Stack>
  )
} 