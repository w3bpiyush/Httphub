import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Alert, Modal, Linking, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../contexts/AuthContext'

const Profile = () => {
  const { user, logout } = useAuth()
  const [showAboutModal, setShowAboutModal] = useState(false)

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout()
            } catch (error) {
              console.error('Logout error:', error)
              Alert.alert('Error', 'Failed to logout. Please try again.')
            }
          },
        },
      ]
    )
  }

  const handleHelpSupport = async () => {
    try {
      const email = 'w3bpiyush@gmail.com'
      const subject = 'HTTP Hub - Help & Support'
      const body = 'Hello,\n\nI need help with HTTP Hub app.\n\n'
      
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
      const canOpen = await Linking.canOpenURL(mailtoUrl)
      if (canOpen) {
        await Linking.openURL(mailtoUrl)
      } else {
        Alert.alert('Error', 'Unable to open email app. Please email us at w3bpiyush@gmail.com')
      }
    } catch (error) {
      console.error('Error opening email:', error)
      Alert.alert('Error', 'Unable to open email app. Please email us at w3bpiyush@gmail.com')
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Profile</Text>
      </View>

      {/* User Info */}
      <View className="p-6">
        <View className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          {/* Avatar Section */}
          <View className="items-center">
            <View className="w-24 h-24 bg-amber-700 rounded-full items-center justify-center mb-3">
              <Text className="text-white text-4xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          </View>

          {/* Name and Organization Section */}
          <View className="mb-6">
            {/* Name with decorative elements */}
            <View className="flex-row items-center justify-center mb-3">
              <View className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
              <Text className="text-2xl font-bold text-gray-900 text-center">
                {user?.name || 'User'}
              </Text>
              <View className="w-2 h-2 bg-amber-500 rounded-full ml-2" />
            </View>
            
            

            {/* Member since with unique design */}
            <View className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 rounded-2xl border border-amber-200">
              <View className="flex-row items-center justify-center">
                <Ionicons name="calendar" size={16} color="#D97706" className="mr-2" />
                <Text className="text-amber-800 font-medium text-center">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  }) : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

        </View>

        {/* Menu Items */}
        <View className="space-y-3">
          <TouchableOpacity className="bg-white p-4 rounded-lg border border-gray-200 flex-row items-center mb-2">
            <View className="w-10 h-10 bg-blue-500 rounded-lg items-center justify-center mr-4">
              <Ionicons name="person" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900">Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white p-4 rounded-lg border border-gray-200 flex-row items-center mb-2"
            onPress={handleHelpSupport}
          >
            <View className="w-10 h-10 bg-green-500 rounded-lg items-center justify-center mr-4">
              <Ionicons name="help-circle" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white p-4 rounded-lg border border-gray-200 flex-row items-center mb-2"
            onPress={() => setShowAboutModal(true)}
          >
            <View className="w-10 h-10 bg-purple-500 rounded-lg items-center justify-center mr-4">
              <Ionicons name="information-circle" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900">About</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-500 p-4 rounded-lg mt-6 items-center"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View className="flex-1 bg-gray-800 bg-opacity-30 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            {/* Handle Bar */}
            <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            
            

            {/* Information Cards */}
            <View className="space-y-4 mb-8">
              <View className="bg-blue-50 p-4 rounded-xl flex-row items-center mb-2">
                <View className="w-8 h-8 bg-blue-500 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="apps" size={16} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-blue-800 font-medium">App Name</Text>
                  <Text className="text-blue-900 font-semibold">HTTP Hub</Text>
                </View>
              </View>

              <View className="bg-green-50 p-4 rounded-xl flex-row items-center mb-2">
                <View className="w-8 h-8 bg-green-500 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="git-branch" size={16} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-green-800 font-medium">Version</Text>
                  <Text className="text-green-900 font-semibold">1.0.0</Text>
                </View>
              </View>

              <View className="bg-purple-50 p-4 rounded-xl flex-row items-center mb-2">
                <View className="w-8 h-8 bg-purple-500 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="person" size={16} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-purple-800 font-medium">Programmer</Text>
                  <Text className="text-purple-900 font-semibold">Piyush Manna</Text>
                </View>
              </View>

              <View className="bg-orange-50 p-4 rounded-xl flex-row items-center mb-2">
                <View className="w-8 h-8 bg-orange-500 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="flag" size={16} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-orange-800 font-medium">Origin Country</Text>
                  <Text className="text-orange-900 font-semibold">India</Text>
                </View>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              className="bg-amber-600 p-4 rounded-xl items-center"
              onPress={() => setShowAboutModal(false)}
            >
              <Text className="text-white font-semibold text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Profile 