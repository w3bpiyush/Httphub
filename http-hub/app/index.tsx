import React, { useEffect } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../contexts/AuthContext'

const Splash = () => {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      // Wait a bit to show splash screen
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(home)/dashboard')
        } else {
          router.replace('/(auth)/login')
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, isLoading])

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">

      <View className="w-20 h-20 mb-6 items-center justify-center bg-amber-700 rounded-lg">
        <Text className="text-white text-3xl font-bold">API</Text>
      </View>

      <ActivityIndicator size="large" color="#B45309" className="mb-8" />

      <View className="absolute bottom-8">
        <Text className="text-sm text-gray-500">
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default Splash 