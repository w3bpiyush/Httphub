import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StatusBar, TextInput, Modal, Alert, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Collection {
  _id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
}

const Collections = () => {
  const { user } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionDescription, setNewCollectionDescription] = useState('')
  const [isAddingCollection, setIsAddingCollection] = useState(false)

  const API_BASE = 'http://192.168.1.70:3000/api/collections'

  const fetchCollections = async () => {
    try {
      if (!user?.id) {
        console.error('User ID not available')
        return
      }

      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(`${API_BASE}/user/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch collections`)

      const data = await response.json()
      setCollections(data.collections || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
      Alert.alert('Error', 'Failed to fetch collections. Please try again.')
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [user?.id])

  const onRefresh = () => {
    setRefreshing(true)
    fetchCollections()
  }

  /** ADD COLLECTION IMPLEMENTATION */
  const handleAddCollection = async () => {
    if (!newCollectionName.trim() || !newCollectionDescription.trim()) {
      Alert.alert('Error', 'Please fill in both name and description')
      return
    }
  
    setIsAddingCollection(true)
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('Authentication token not found')
  
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCollectionName.trim(),
          description: newCollectionDescription.trim(),
          createdBy: user?.id || '',
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create collection' }))
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create collection`)
      }
  
      const responseData = await response.json()
      const created: Collection = responseData.collection 
  
      setCollections(prev => [created, ...prev])
      setNewCollectionName('')
      setNewCollectionDescription('')
      setShowAddModal(false)
      Alert.alert('Success', responseData.message || 'Collection created successfully!')
    } catch (error) {
      console.error('Error creating collection:', error)
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create collection. Please try again.')
    } finally {
      setIsAddingCollection(false)
    }
  }

  const handleCollectionPress = (collection: Collection) => {
    Alert.alert('Collection', `Opening ${collection.name}`)
  }

  const handleEditCollection = (collection: Collection) => {
    Alert.alert('Edit Collection', `Editing ${collection.name}`)
  }

  /** DELETE COLLECTION IMPLEMENTATION */
  const handleDeleteCollection = (collectionId: string) => {
    Alert.alert(
      'Delete Collection',
      'Are you sure you want to delete this collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken')
              if (!token) throw new Error('Authentication token not found')

              const response = await fetch(`${API_BASE}/${collectionId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              })

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to delete collection' }))
                throw new Error(errorData.message || `HTTP ${response.status}: Failed to delete collection`)
              }

              const data = await response.json()
              setCollections(prev => prev.filter(c => c._id !== collectionId))
              Alert.alert('Success', data.message || 'Collection deleted successfully!')
            } catch (error) {
              console.error('Error deleting collection:', error)
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete collection. Please try again.')
            }
          }
        }
      ]
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        
        <View className="bg-white px-6 py-4 border-b border-gray-200 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900">Collections</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="w-10 h-10 bg-amber-600 rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="w-16 h-16 bg-amber-600 rounded-full items-center justify-center mb-4">
            <Ionicons name="folder" size={32} color="white" />
          </View>
          <Text className="text-lg font-semibold text-gray-600">Loading Collections...</Text>
        </View>
      </SafeAreaView>
    )
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
          <Text className="text-2xl font-bold text-gray-900">Collections</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="w-10 h-10 bg-amber-600 rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Collections List */}
      <ScrollView 
        className="flex-1 p-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {collections.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
              <Ionicons name="folder-open" size={32} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-semibold text-gray-600 mb-2">No Collections Yet</Text>
          </View>
        ) : (
          <View className="space-y-4">
            {collections.map((collection) => (
              <TouchableOpacity
                key={collection._id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-2"
                onPress={() => handleCollectionPress(collection)}
              >
                <Text className="text-xl font-semibold text-gray-900">{collection.name}</Text>
                <Text className="text-gray-600 text-base leading-6 mb-3">{collection.description}</Text>
                
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar" size={16} color="#9CA3AF" />
                    <Text className="text-gray-500 text-sm ml-2">
                      {new Date(collection.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="person" size={16} color="#9CA3AF" />
                    <Text className="text-gray-500 text-sm ml-2">
                      {user?.name || 'Unknown'}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => handleEditCollection(collection)}
                    className="flex-1 flex-row items-center justify-center bg-blue-100 py-3 px-4 rounded-lg"
                  >
                    <Ionicons name="create" size={18} color="#3B82F6" />
                    <Text className="text-blue-600 font-semibold ml-2">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteCollection(collection._id)}
                    className="flex-1 flex-row items-center justify-center bg-red-100 py-3 px-4 rounded-lg"
                  >
                    <Ionicons name="trash" size={18} color="#DC2626" />
                    <Text className="text-red-600 font-semibold ml-2">Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Collection Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-gray-800 bg-opacity-30 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-amber-600 rounded-2xl items-center justify-center mb-3">
                <Ionicons name="folder" size={28} color="white" />
              </View>
              <Text className="text-xl font-bold text-gray-900">Create New Collection</Text>
              <Text className="text-gray-500 text-center">Organize your API requests</Text>
            </View>

            <View className="space-y-4 mb-6">
              <View className='mb-2'>
                <Text className="text-gray-700 mb-2 font-medium">Collection Name</Text>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white"
                  placeholder="Enter collection name"
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  autoCapitalize="words"
                  editable={!isAddingCollection}
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2 font-medium">Description</Text>
                <TextInput
                  className="w-full h-20 px-4 py-3 border border-gray-300 rounded-lg bg-white"
                  placeholder="Describe what this collection is for"
                  value={newCollectionDescription}
                  onChangeText={setNewCollectionDescription}
                  multiline
                  textAlignVertical="top"
                  editable={!isAddingCollection}
                />
              </View>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 bg-gray-300 p-4 rounded-xl items-center"
                onPress={() => setShowAddModal(false)}
                disabled={isAddingCollection}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-4 rounded-xl items-center ${
                  isAddingCollection ? 'bg-gray-400' : 'bg-amber-600'
                }`}
                onPress={handleAddCollection}
                disabled={isAddingCollection}
              >
                <Text className="text-white font-semibold">
                  {isAddingCollection ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Collections
