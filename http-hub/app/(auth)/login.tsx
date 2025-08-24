import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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
      <View className="flex-1 items-center justify-center px-8">
        {/* Header */}
        <View className="mb-12 items-center">
          <View className="w-16 h-16 mb-4 items-center justify-center bg-amber-700 rounded-lg">
            <Text className="text-white text-2xl font-bold">H</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</Text>
          <Text className="text-gray-500 text-center">Sign in to your HTTP Hub account</Text>
        </View>

        {/* Login Form */}
        <View className="w-full space-y-4">
          <View className='mb-2'>
            <Text className="text-gray-700 mb-2 font-medium">Name / Organization Name</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white"
              placeholder="Enter your name or organization"
              value={nameOrOrg}
              onChangeText={setNameOrOrg}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            className={`w-full h-12 rounded-lg items-center justify-center mt-6 ${
              isLoading ? 'bg-gray-400' : 'bg-amber-700'
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-lg">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View className="mt-8 flex-row items-center">
          <Text className="text-gray-500">Don't have an account? </Text>
          <TouchableOpacity onPress={goToRegister} disabled={isLoading}>
            <Text className="text-amber-700 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login 