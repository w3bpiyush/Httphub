import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../contexts/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Request {
  _id: string
  name: string
  method: string
  url: string
  collectionId: string
  createdBy: string
  createdAt: string
}

const RequestList = () => {
  const { user } = useAuth()
  const { collectionId, collectionName } = useLocalSearchParams<{
    collectionId: string
    collectionName: string
  }>()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMethodModal, setShowMethodModal] = useState(false)

  // States for adding request
  const [newRequestName, setNewRequestName] = useState('')
  const [newRequestUrl, setNewRequestUrl] = useState('')
  const [newRequestMethod, setNewRequestMethod] = useState('GET')
  const [isAddingRequest, setIsAddingRequest] = useState(false)

  // States for editing request
  const [editingRequest, setEditingRequest] = useState<Request | null>(null)
  const [editRequestName, setEditRequestName] = useState('')
  const [editRequestUrl, setEditRequestUrl] = useState('')
  const [editRequestMethod, setEditRequestMethod] = useState('GET')
  const [isEditingRequest, setIsEditingRequest] = useState(false)

  const API_BASE = 'http://192.168.1.70:3000/api/requests'

  // Fetch requests of a collection
  const fetchRequests = async () => {
    try {
      if (!collectionId) {
        console.error('Collection ID not available')
        return
      }
      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(`${API_BASE}/collection/${collectionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok)
        throw new Error(`HTTP ${response.status}: Failed to fetch requests`)

      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
      Alert.alert('Error', 'Failed to fetch requests. Please try again.')
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (collectionId) {
      fetchRequests()
    }
  }, [collectionId])

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true)
    fetchRequests()
  }

  // Handle "Add Request" button press
  const handleAddRequest = () => {
    setShowAddModal(true)
  }

  // Create new request API call
  const handleCreateRequest = async () => {
    if (!newRequestName.trim() || !newRequestUrl.trim() || !newRequestMethod.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsAddingRequest(true)
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newRequestName.trim(),
          url: newRequestUrl.trim(),
          method: newRequestMethod.trim(),
          collection: collectionId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Failed to create request',
        }))
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to create request`
        )
      }

      const responseData = await response.json()
      const created: Request = responseData.request

      setRequests((prev) => [created, ...prev])
      setNewRequestName('')
      setNewRequestUrl('')
      setNewRequestMethod('GET')
      setShowAddModal(false)
      Alert.alert('Success', responseData.message || 'Request created successfully!')
    } catch (error) {
      console.error('Error creating request:', error)
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to create request. Please try again.'
      )
    } finally {
      setIsAddingRequest(false)
    }
  }

  // Open Edit Request modal and populate fields
  const handleEditRequest = (request: Request) => {
    setEditingRequest(request)
    setEditRequestName(request.name)
    setEditRequestUrl(request.url)
    setEditRequestMethod(request.method.toUpperCase())
    setShowEditModal(true)
  }

  // Update request API call
  const handleUpdateRequest = async () => {
    if (
      !editingRequest ||
      !editRequestName.trim() ||
      !editRequestUrl.trim() ||
      !editRequestMethod.trim()
    ) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsEditingRequest(true)
    try {
      const token = await AsyncStorage.getItem('authToken')
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(`${API_BASE}/${editingRequest._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editRequestName.trim(),
          url: editRequestUrl.trim(),
          method: editRequestMethod.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Failed to update request',
        }))
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to update request`
        )
      }

      const responseData = await response.json()
      const updated: Request = responseData.request

      setRequests((prev) => prev.map((r) => (r._id === updated._id ? updated : r)))

      setShowEditModal(false)
      setEditingRequest(null)
      setEditRequestName('')
      setEditRequestUrl('')
      setEditRequestMethod('GET')
      Alert.alert('Success', responseData.message || 'Request updated successfully!')
    } catch (error) {
      console.error('Error updating request:', error)
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to update request. Please try again.'
      )
    } finally {
      setIsEditingRequest(false)
    }
  }

  // Handle request item press (placeholder)
  const handleRequestPress = (request: Request) => {
    Alert.alert('Request', `Opening ${request.name}`)
  }

  // Handle delete request
  const handleDeleteRequest = (request: Request) => {
    Alert.alert(
      'Delete Request',
      `Are you sure you want to delete "${request.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken')
              if (!token) throw new Error('Authentication token not found')

              const response = await fetch(`${API_BASE}/${request._id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                  message: 'Failed to delete request',
                }))
                throw new Error(
                  errorData.message || `HTTP ${response.status}: Failed to delete request`
                )
              }

              const data = await response.json()
              setRequests((prev) => prev.filter((r) => r._id !== request._id))
              Alert.alert('Success', data.message || 'Request deleted successfully!')
            } catch (error) {
              console.error('Error deleting request:', error)
              Alert.alert(
                'Error',
                error instanceof Error
                  ? error.message
                  : 'Failed to delete request. Please try again.'
              )
            }
          },
        },
      ]
    )
  }

  // Coloring for HTTP method badges
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-green-100 text-green-800'
      case 'POST':
        return 'bg-blue-100 text-blue-800'
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800'
      case 'PATCH':
        return 'bg-orange-100 text-orange-800'
      case 'DELETE':
        return 'bg-red-100 text-red-800'
      case 'HEAD':
        return 'bg-purple-100 text-purple-800'
      case 'OPTIONS':
        return 'bg-teal-100 text-teal-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
            <Text className="text-2xl font-bold text-gray-900">Loading...</Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center">
          <View className="w-16 h-16 bg-amber-600 rounded-full items-center justify-center mb-4">
            <Ionicons name="document-text" size={32} color="white" />
          </View>
          <Text className="text-lg font-semibold text-gray-600">Loading Requests...</Text>
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
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              {(collectionName || 'Requests').length > 15
                ? `${(collectionName || 'Requests').substring(0, 15)}...`
                : collectionName || 'Requests'}
            </Text>
            <Text className="text-sm text-gray-500">
              {requests.length} request{requests.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleAddRequest}
          className="w-10 h-10 bg-amber-600 rounded-full items-center justify-center"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <ScrollView
        className="flex-1 p-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {requests.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
              <Ionicons name="document-text" size={32} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-semibold text-gray-600 mb-2">No Requests Yet</Text>
          </View>
        ) : (
          <View className="space-y-4">
            {requests.map((request) => (
              <TouchableOpacity
                key={request._id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
                onPress={() => handleRequestPress(request)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-xl font-semibold text-gray-900">{request.name}</Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View className={`px-3 py-1 rounded-full ${getMethodColor(request.method)}`}>
                      <Text className="text-xs font-semibold">{request.method.toUpperCase()}</Text>
                    </View>
                    <Text className="text-gray-600 text-sm ml-3 flex-1" numberOfLines={1}>
                      {request.url}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar" size={16} color="#9CA3AF" />
                    <Text className="text-gray-500 text-sm ml-2">
                      {new Date(request.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="person" size={16} color="#9CA3AF" />
                    <Text className="text-gray-500 text-sm ml-2">{user?.name || 'Unknown'}</Text>
                  </View>
                </View>

                {/* Menu Options */}
                <View className="mt-4 pt-4 border-t border-gray-100">
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => handleEditRequest(request)}
                      className="flex-1 flex-row items-center justify-center bg-blue-100 py-3 px-4 rounded-lg"
                    >
                      <Ionicons name="create" size={18} color="#3B82F6" />
                      <Text className="text-blue-600 font-semibold ml-2">Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteRequest(request)}
                      className="flex-1 flex-row items-center justify-center bg-red-100 py-3 px-4 rounded-lg"
                    >
                      <Ionicons name="trash" size={18} color="#DC2626" />
                      <Text className="text-red-600 font-semibold ml-2">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Request Modal */}
      <Modal visible={showAddModal} transparent animationType="slide" onRequestClose={() => setShowAddModal(false)}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => {
            setShowMethodModal(false)
            setShowAddModal(false)
            setNewRequestName('')
            setNewRequestUrl('')
            setNewRequestMethod('GET')
          }}
        >
          <View className="flex-1 bg-black bg-opacity-30 justify-end">
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View className="bg-white rounded-t-3xl p-6">
                <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                <View className="items-center mb-6">
                  <View className="w-16 h-16 bg-amber-600 rounded-2xl items-center justify-center mb-3">
                    <Ionicons name="document-text" size={28} color="white" />
                  </View>
                  <Text className="text-xl font-bold text-gray-900">Create New Request</Text>
                  <Text className="text-gray-500 text-center">Add a new API request to this collection</Text>
                </View>

                <View className="space-y-4 mb-6">
                  <View className="mb-2">
                    <Text className="text-gray-700 mb-2 font-medium">Request Name</Text>
                    <TextInput
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white"
                      placeholder="Enter request name"
                      value={newRequestName}
                      onChangeText={setNewRequestName}
                      autoCapitalize="words"
                      editable={!isAddingRequest}
                    />
                  </View>

                  <View className="mb-2">
                    <Text className="text-gray-700 mb-2 font-medium">URL</Text>
                    <TextInput
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white"
                      placeholder="https://api.example.com/endpoint"
                      value={newRequestUrl}
                      onChangeText={setNewRequestUrl}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      editable={!isAddingRequest}
                    />
                  </View>

                  <View className="mb-2">
                    <Text className="text-gray-700 mb-2 font-medium">HTTP Method</Text>
                    <TouchableOpacity
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white flex-row items-center justify-between"
                      onPress={() => setShowMethodModal(true)}
                      disabled={isAddingRequest}
                    >
                      <Text className={`${newRequestMethod ? 'text-gray-900' : 'text-gray-500'}`}>
                        {newRequestMethod || 'Select HTTP Method'}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="flex-1 bg-gray-300 p-4 rounded-xl items-center"
                    onPress={() => {
                      setShowAddModal(false)
                      setNewRequestName('')
                      setNewRequestUrl('')
                      setNewRequestMethod('GET')
                    }}
                    disabled={isAddingRequest}
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 p-4 rounded-xl items-center ${
                      isAddingRequest ? 'bg-gray-400' : 'bg-amber-600'
                    }`}
                    onPress={handleCreateRequest}
                    disabled={isAddingRequest}
                  >
                    <Text className="text-white font-semibold">{isAddingRequest ? 'Creating...' : 'Create'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Request Modal */}
      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => {
            setShowEditModal(false)
            setEditingRequest(null)
            setEditRequestName('')
            setEditRequestUrl('')
            setEditRequestMethod('GET')
          }}
        >
          <View className="flex-1 bg-black bg-opacity-30 justify-end">
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View className="bg-white rounded-t-3xl p-6">
                <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                <View className="items-center mb-6">
                  <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-3">
                    <Ionicons name="create" size={28} color="white" />
                  </View>
                  <Text className="text-xl font-bold text-gray-900">Edit Request</Text>
                  <Text className="text-gray-500 text-center">Update request details</Text>
                </View>

                <View className="space-y-4 mb-6">
                  <View className="mb-2">
                    <Text className="text-gray-700 mb-2 font-medium">Request Name</Text>
                    <TextInput
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white"
                      placeholder="Enter request name"
                      value={editRequestName}
                      onChangeText={setEditRequestName}
                      autoCapitalize="words"
                      editable={!isEditingRequest}
                    />
                  </View>

                  <View className="mb-2">
                    <Text className="text-gray-700 mb-2 font-medium">URL</Text>
                    <TextInput
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white"
                      placeholder="https://api.example.com/endpoint"
                      value={editRequestUrl}
                      onChangeText={setEditRequestUrl}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      editable={!isEditingRequest}
                    />
                  </View>

                  <View className="mb-2">
                    <Text className="text-gray-700 mb-2 font-medium">HTTP Method</Text>
                    <TouchableOpacity
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-white flex-row items-center justify-between"
                      onPress={() => setShowMethodModal(true)}
                      disabled={isEditingRequest}
                    >
                      <Text className={`${editRequestMethod ? 'text-gray-900' : 'text-gray-500'}`}>
                        {editRequestMethod || 'Select HTTP Method'}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="flex-1 bg-gray-300 p-4 rounded-xl items-center"
                    onPress={() => {
                      setShowEditModal(false)
                      setEditingRequest(null)
                      setEditRequestName('')
                      setEditRequestUrl('')
                      setEditRequestMethod('GET')
                    }}
                    disabled={isEditingRequest}
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 p-4 rounded-xl items-center ${
                      isEditingRequest ? 'bg-gray-400' : 'bg-blue-600'
                    }`}
                    onPress={handleUpdateRequest}
                    disabled={isEditingRequest}
                  >
                    <Text className="text-white font-semibold">
                      {isEditingRequest ? 'Updating...' : 'Update'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* HTTP Method Selection Modal (shared for Add & Edit) */}
      <Modal
        visible={showMethodModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMethodModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-30 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 mx-6 w-80">
            <View className="space-y-2 mb-6">
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((method) => {
                const isSelected = method === (editingRequest ? editRequestMethod : newRequestMethod)
                return (
                  <TouchableOpacity
                    key={method}
                    className={`p-4 rounded-xl border mb-2 ${
                      isSelected ? 'bg-amber-100 border-amber-300' : 'bg-white border-gray-200'
                    }`}
                    onPress={() => {
                      if (editingRequest) {
                        setEditRequestMethod(method)
                      } else {
                        setNewRequestMethod(method)
                      }
                      setShowMethodModal(false)
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className={`text-lg font-semibold ${isSelected ? 'text-amber-800' : 'text-gray-700'}`}>
                        {method}
                      </Text>
                      {isSelected && <Ionicons name="checkmark-circle" size={24} color="#D97706" />}
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>

            <TouchableOpacity
              className="w-full bg-gray-300 p-4 rounded-xl items-center"
              onPress={() => setShowMethodModal(false)}
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default RequestList
