import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()

  const handleRegister = async () => {
    if (!name || !organization || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      await register(name, organization, password)
      router.replace('/(home)/dashboard')
    } catch (error) {
      console.error('Registration error:', error)
      Alert.alert('Error', error instanceof Error ? error.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const goToLogin = () => {
    router.push('/(auth)/login')
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center px-8">
        {/* Header */}
        <View className="mb-12 items-center">
          <View className="w-16 h-16 mb-4 items-center justify-center bg-amber-700 rounded-lg">
            <Text className="text-white text-2xl font-bold">H</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-gray-500 text-center">Join HTTP Hub today</Text>
        </View>

        {/* Registration Form */}
        <View className="w-full space-y-4">
          <View className='mb-2'>
            <Text className="text-gray-700 mb-2 font-medium">Name</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

          <View className='mb-2'>
            <Text className="text-gray-700 mb-2 font-medium">Organization Name</Text>
            <TextInput
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white"
              placeholder="Enter organization name"
              value={organization}
              onChangeText={setOrganization}
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
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-white font-semibold text-lg">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View className="mt-8 flex-row items-center">
          <Text className="text-gray-500">Already have an account? </Text>
          <TouchableOpacity onPress={goToLogin} disabled={isLoading}>
            <Text className="text-amber-700 font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Register 