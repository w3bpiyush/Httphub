import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '../contexts/AuthContext'
import "../global.css"

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Splash' }} />
        <Stack.Screen name="(auth)" options={{ title: 'Authentication' }} />
        <Stack.Screen name="(home)" options={{ title: 'Home' }} />
        <Stack.Screen name="collections" options={{ title: 'Collections' }} />
        <Stack.Screen name="request" options={{ title: 'Request' }} />
      </Stack>
    </AuthProvider>
  )
}

export default RootLayout
