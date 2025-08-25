import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'

const EditProfile = () => {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [password, setPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setName(user?.name || '')
    setOrganization(user?.orgName || '')
  }, [user])

  const onSave = async () => {
    if (!name.trim() || !organization.trim()) {
      Alert.alert('Validation', 'Name and organization are required')
      return
    }
    setIsSaving(true)
    try {
      await updateProfile(name.trim(), organization.trim(), password)
      Alert.alert('Success', 'Profile updated')
      router.back()
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Edit Profile</Text>
        </View>
      </View>

      {/* Form */}
      <View className="flex-1 p-6">
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Name</Text>
          <TextInput
            className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-white"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            editable={!isSaving}
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Organization</Text>
          <TextInput
            className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-white"
            placeholder="Enter organization name"
            value={organization}
            onChangeText={setOrganization}
            editable={!isSaving}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Password</Text>
          <TextInput
            className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-white"
            placeholder="Enter new password (optional)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isSaving}
          />
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity className="flex-1 bg-gray-200 p-4 rounded-lg items-center" onPress={() => router.back()} disabled={isSaving}>
            <Text className="text-gray-800 font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity className={`flex-1 p-4 rounded-lg items-center ${isSaving ? 'bg-gray-400' : 'bg-amber-600'}`} onPress={onSave} disabled={isSaving}>
            <Text className="text-white font-semibold">{isSaving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default EditProfile 