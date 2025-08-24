import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  const handleCollectionsPress = () => {
    router.push('/collections')
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">HTTP Hub</Text>
        </View>

        {/* Quick Actions */}
        <View className="p-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
          <View className="space-y-3 mb-2">
            <TouchableOpacity className="bg-white p-4 rounded-lg border border-gray-200 flex-row items-center mb-2">
              <View className="w-10 h-10 bg-blue-500 rounded-lg items-center justify-center mr-4">
                <Ionicons name="add" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900">New Request</Text>
                <Text className="text-gray-500 text-sm">Create a new API request</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white p-4 rounded-lg border border-gray-200 flex-row items-center mb-2"
              onPress={handleCollectionsPress}
            >
              <View className="w-10 h-10 bg-green-500 rounded-lg items-center justify-center mr-4">
                <Ionicons name="folder" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900">Collections</Text>
                <Text className="text-gray-500 text-sm">Manage your API collections</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-lg border border-gray-200 flex-row items-center mb-2">
              <View className="w-10 h-10 bg-purple-500 rounded-lg items-center justify-center mr-4">
                <Ionicons name="settings" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900">Environments</Text>
                <Text className="text-gray-500 text-sm">Configure API environments</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Dashboard 