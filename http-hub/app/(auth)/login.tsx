import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [nameOrOrg, setNameOrOrg] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleLogin = async () => {
    if (!nameOrOrg || !password) {
      Alert.alert('Error', 'Please enter both name/organization and password')
      return
    }

    setIsLoading(true)
    try {
      await login(nameOrOrg, password)
      router.replace('/(home)/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      Alert.alert('Error', error instanceof Error ? error.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const goToRegister = () => {
    router.push('/(auth)/register')
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-2xl font-bold text-gray-900">Sign In</Text>
        </View>
      </View>

      {/* Form */}
      <View className="flex-1 p-6">
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Name / Organization Name</Text>
          <TextInput
            className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-white"
            placeholder="Enter your name or organization"
            value={nameOrOrg}
            onChangeText={setNameOrOrg}
            autoCapitalize="words"
            editable={!isLoading}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Password</Text>
          <TextInput
            className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-white"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          className={`w-full h-12 rounded-lg items-center justify-center ${isLoading ? 'bg-gray-400' : 'bg-amber-600'}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold text-lg">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View className="mt-8 flex-row items-center justify-center">
          <Text className="text-gray-500">Don't have an account? </Text>
          <TouchableOpacity onPress={goToRegister} disabled={isLoading}>
            <Text className="text-amber-600 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login 