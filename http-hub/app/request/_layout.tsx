import React from 'react'
import { Stack } from 'expo-router'
import { RequestProvider } from '../../contexts/RequestContext'

export default function RequestLayout() {
  return (
    <RequestProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Request' }} />
      </Stack>
    </RequestProvider>
  )
} 