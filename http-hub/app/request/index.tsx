import React, { useMemo, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'
import { useRequest } from '../../contexts/RequestContext'
import { AuthState, FormDataItem, HttpMethod, KeyValue, RawFormat, RequestState } from '../../types/RequestTypes'

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
const RAW_FORMATS: RawFormat[] = ['json', 'text', 'javascript', 'html', 'xml']

type ResponseState = {
  loading: boolean
  status?: number
  statusText?: string
  headers: KeyValue[]
  bodyText: string
  error?: string
}

const toKeyValueArray = (headers: Headers): KeyValue[] => {
  const arr: KeyValue[] = []
  headers.forEach((value, key) => arr.push({ key, value }))
  return arr
}

const prettifyBody = (text: string, format: RawFormat): string => {
  try {
    if (format === 'json') {
      const obj = JSON.parse(text)
      return JSON.stringify(obj, null, 2)
    }
    return text
  } catch {
    return text
  }
}

const buildQuery = (baseUrl: string, params: KeyValue[]): string => {
  const url = new URL(baseUrl)
  params.filter(p => p.key).forEach(p => url.searchParams.set(p.key, p.value))
  return url.toString()
}

const applyAuth = (auth: AuthState, headers: Record<string, string>, url: string): { headers: Record<string, string>, url: string } => {
  switch (auth.type) {
    case 'basic': {
      const token = btoa(`${auth.username}:${auth.password}`)
      headers['Authorization'] = `Basic ${token}`
      return { headers, url }
    }
    case 'bearer': {
      headers['Authorization'] = `Bearer ${auth.token}`
      return { headers, url }
    }
    case 'apikey': {
      if (auth.location === 'header') {
        headers[auth.key] = auth.value
        return { headers, url }
      }
      const u = new URL(url)
      u.searchParams.set(auth.key, auth.value)
      return { headers, url: u.toString() }
    }
    default:
      return { headers, url }
  }
}

const RequestScreen = () => {
  const { request, dispatch } = useRequest()

  const [showMethodModal, setShowMethodModal] = useState(false)
  const [showFormatModal, setShowFormatModal] = useState(false)
  const [response, setResponse] = useState<ResponseState>({ loading: false, headers: [], bodyText: '' })
  const [responseView, setResponseView] = useState<'Pretty' | 'Raw' | 'Preview'>('Pretty')
  const abortRef = useRef<AbortController | null>(null)
  const [showMenu, setShowMenu] = useState(false)

  const canSend = useMemo(() => !!request.url && !!request.method, [request.url, request.method])

  const clearResponse = () => {
    setResponse({ loading: false, headers: [], bodyText: '' })
    setShowMenu(false)
  }

  const handleAddPair = (type: 'headers' | 'params' | 'formData') => {
    const next: KeyValue = { key: '', value: '' }
    if (type === 'headers') dispatch({ type: 'SET_HEADERS', headers: [...request.headers, next] })
    if (type === 'params') dispatch({ type: 'SET_PARAMS', params: [...request.params, next] })
    if (type === 'formData') dispatch({ type: 'SET_FORM_DATA', formData: [...request.formData, { key: '', value: '', type: 'text' }] })
  }

  const handleRemovePair = (type: 'headers' | 'params' | 'formData', index: number) => {
    if (type === 'headers') dispatch({ type: 'SET_HEADERS', headers: request.headers.filter((_, i) => i !== index) })
    if (type === 'params') dispatch({ type: 'SET_PARAMS', params: request.params.filter((_, i) => i !== index) })
    if (type === 'formData') dispatch({ type: 'SET_FORM_DATA', formData: request.formData.filter((_, i) => i !== index) })
  }

  const pickFile = async (index: number) => {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
    if (res.canceled || !res.assets?.length) return
    const f = res.assets[0]
    const updated: FormDataItem[] = request.formData.map((item, i) => i === index ? {
      ...item,
      type: 'file',
      value: f.name || 'file',
      file: { uri: f.uri, name: f.name || 'file', type: f.mimeType || 'application/octet-stream' }
    } : item)
    dispatch({ type: 'SET_FORM_DATA', formData: updated })
  }

  const buildBodyAndHeaders = () => {
    const headers: Record<string, string> = {}
    request.headers.filter(h => h.key).forEach(h => headers[h.key] = h.value)

    if (request.method === 'GET' || request.method === 'HEAD') {
      return { body: undefined as BodyInit | undefined, headers }
    }

    if (request.bodyType === 'raw') {
      const contentTypeMap: Record<RawFormat, string> = {
        json: 'application/json',
        text: 'text/plain',
        javascript: 'application/javascript',
        html: 'text/html',
        xml: 'application/xml',
      }
      headers['Content-Type'] = contentTypeMap[request.rawFormat]
      return { body: request.rawBody, headers }
    }

    const form = new FormData()
    request.formData.forEach(item => {
      if (!item.key) return
      if (item.type === 'file' && item.file) {
        form.append(item.key, {
          uri: item.file.uri,
          name: item.file.name,
          type: item.file.type,
        } as any)
      } else {
        form.append(item.key, item.value)
      }
    })
    return { body: form, headers }
  }

  const sendRequest = async () => {
    if (!canSend) return

    const controller = new AbortController()
    abortRef.current = controller

    setResponse({ loading: true, headers: [], bodyText: '' })

    try {
      const urlWithQuery = buildQuery(request.url, request.params)
      let { body, headers } = buildBodyAndHeaders()
      const authApplied = applyAuth(request.auth, headers, urlWithQuery)

      const timeoutId = setTimeout(() => controller.abort(), 20000)

      const res = await fetch(authApplied.url, {
        method: request.method,
        headers: authApplied.headers,
        body,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const statusText = `${res.status} ${res.statusText || ''}`.trim()
      const text = await res.text()
      const headersArr = toKeyValueArray(res.headers)

      setResponse({
        loading: false,
        status: res.status,
        statusText,
        headers: headersArr,
        bodyText: text,
      })
      dispatch({ type: 'SET_TAB', tab: 'Response' })
    } catch (e: any) {
      setResponse({ loading: false, headers: [], bodyText: '', error: e?.name === 'AbortError' ? 'Request cancelled or timed out' : (e?.message || 'Request failed') })
      dispatch({ type: 'SET_TAB', tab: 'Response' })
    } finally {
      abortRef.current = null
    }
  }

  const cancelRequest = () => {
    abortRef.current?.abort()
  }

  const prettyText = useMemo(() => prettifyBody(response.bodyText, request.rawFormat), [response.bodyText, request.rawFormat])

  const TabButton = ({ label }: { label: RequestState['tab'] }) => (
    <TouchableOpacity
      onPress={() => dispatch({ type: 'SET_TAB', tab: label })}
      className={`px-4 py-2 rounded-full mr-2 ${request.tab === label ? 'bg-amber-600' : 'bg-gray-200'}`}
    >
      <Text className={`${request.tab === label ? 'text-white' : 'text-gray-700'} font-medium`}>{label}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()} className="mr-3">
                <Ionicons name="arrow-back" size={22} color="#374151" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-900">Request</Text>
            </View>
            <TouchableOpacity onPress={() => setShowMenu(true)} className="w-9 h-9 rounded-full items-center justify-center">
              <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Name / Method / URL */}
          <View className="mt-4">
            <TextInput
              className="w-full h-10 px-4 py-2 mb-2 border border-gray-300 rounded-lg bg-white"
              placeholder="Request name"
              value={request.name}
              onChangeText={(t) => dispatch({ type: 'SET_NAME', name: t })}
            />

            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => setShowMethodModal(true)} className="h-10 px-4 py-2 mr-2 border border-gray-300 rounded-lg bg-white justify-center">
                <Text className="text-gray-900 font-medium">{request.method}</Text>
              </TouchableOpacity>

              <TextInput
                className="flex-1 h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                placeholder="https://api.example.com/path"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                value={request.url}
                onChangeText={(t) => dispatch({ type: 'SET_URL', url: t })}
              />
            </View>
          </View>
        </View>

        {/* Top right menu */}
        <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.08)' }} onPress={() => setShowMenu(false)}>
            <View className="absolute right-3 top-14 bg-white rounded-lg border border-gray-200 shadow-lg">
              <TouchableOpacity className="px-4 py-3" onPress={clearResponse}>
                <Text className="text-gray-900">Clear Response</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {/* Tabs */}
        <View className="px-4 py-3 bg-white border-b border-gray-200">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TabButton label="Headers" />
            <TabButton label="Params" />
            <TabButton label="Body" />
            <TabButton label="Auth" />
            <TabButton label="Response" />
          </ScrollView>
        </View>

        {/* Content */}
        <View className="flex-1">
          {request.tab === 'Headers' && (
            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              {request.headers.map((h, idx) => (
                <View key={idx} className="flex-row items-center mb-2">
                  <TextInput className="flex-1 h-10 px-4 py-2 border border-gray-300 rounded-l-lg bg-white" placeholder="Key" value={h.key} onChangeText={(t) => {
                    const next = [...request.headers]
                    next[idx] = { ...next[idx], key: t }
                    dispatch({ type: 'SET_HEADERS', headers: next })
                  }} />
                  <TextInput className="flex-1 h-10 px-4 py-2 border-t border-b border-gray-300 bg-white" placeholder="Value" value={h.value} onChangeText={(t) => {
                    const next = [...request.headers]
                    next[idx] = { ...next[idx], value: t }
                    dispatch({ type: 'SET_HEADERS', headers: next })
                  }} />
                  <TouchableOpacity className="h-10 px-3 bg-red-100 rounded-r-lg items-center justify-center" onPress={() => handleRemovePair('headers', idx)}>
                    <Ionicons name="trash" size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity className="mt-2 bg-amber-600 p-3 rounded-lg items-center" onPress={() => handleAddPair('headers')}>
                <Text className="text-white font-semibold">Add Header</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {request.tab === 'Params' && (
            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              {request.params.map((p, idx) => (
                <View key={idx} className="flex-row items-center mb-2">
                  <TextInput className="flex-1 h-10 px-4 py-2 border border-gray-300 rounded-l-lg bg-white" placeholder="Key" value={p.key} onChangeText={(t) => {
                    const next = [...request.params]
                    next[idx] = { ...next[idx], key: t }
                    dispatch({ type: 'SET_PARAMS', params: next })
                  }} />
                  <TextInput className="flex-1 h-10 px-4 py-2 border-t border-b border-gray-300 bg-white" placeholder="Value" value={p.value} onChangeText={(t) => {
                    const next = [...request.params]
                    next[idx] = { ...next[idx], value: t }
                    dispatch({ type: 'SET_PARAMS', params: next })
                  }} />
                  <TouchableOpacity className="h-10 px-3 bg-red-100 rounded-r-lg items-center justify-center" onPress={() => handleRemovePair('params', idx)}>
                    <Ionicons name="trash" size={18} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity className="mt-2 bg-amber-600 p-3 rounded-lg items-center" onPress={() => handleAddPair('params')}>
                <Text className="text-white font-semibold">Add Param</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {request.tab === 'Body' && (
            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              <View className="flex-row mb-3">
                <TouchableOpacity onPress={() => dispatch({ type: 'SET_BODY_TYPE', bodyType: 'raw' })} className={`px-3 py-2 rounded-l-lg border ${request.bodyType === 'raw' ? 'bg-amber-600 border-amber-600' : 'bg-white border-gray-300'}`}>
                  <Text className={`${request.bodyType === 'raw' ? 'text-white' : 'text-gray-700'} font-medium`}>Raw</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => dispatch({ type: 'SET_BODY_TYPE', bodyType: 'form-data' })} className={`px-3 py-2 rounded-r-lg border ${request.bodyType === 'form-data' ? 'bg-amber-600 border-amber-600' : 'bg-white border-gray-300'}`}>
                  <Text className={`${request.bodyType === 'form-data' ? 'text-white' : 'text-gray-700'} font-medium`}>Form-data</Text>
                </TouchableOpacity>
              </View>

              {request.bodyType === 'raw' && (
                <View>
                  <View className="flex-row items-center mb-2">
                    <TouchableOpacity onPress={() => setShowFormatModal(true)} className="h-9 px-3 mr-2 border border-gray-300 rounded-lg bg-white justify-center">
                      <Text className="text-gray-900">{request.rawFormat.toUpperCase()}</Text>
                    </TouchableOpacity>
                    <Text className="text-gray-500">Select format</Text>
                  </View>
                  <TextInput
                    className="min-h-[200px] p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
                    value={request.rawBody}
                    onChangeText={(t) => dispatch({ type: 'SET_RAW_BODY', rawBody: t })}
                    placeholder={request.rawFormat === 'json' ? '{\n  "key": "value"\n}' : 'Enter request body'}
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              )}

              {request.bodyType === 'form-data' && (
                <View>
                  {request.formData.map((item, idx) => (
                    <View key={idx} className="mb-2">
                      <View className="flex-row items-center mb-1">
                        <TextInput className="flex-1 h-10 px-4 py-2 border border-gray-300 rounded-l-lg bg-white" placeholder="Key" value={item.key} onChangeText={(t) => {
                          const next = [...request.formData]
                          next[idx] = { ...next[idx], key: t }
                          dispatch({ type: 'SET_FORM_DATA', formData: next })
                        }} />
                        {item.type === 'file' ? (
                          <TouchableOpacity className="h-10 px-3 border-t border-b border-gray-300 bg-white justify-center" onPress={() => pickFile(idx)}>
                            <Text className="text-gray-900" numberOfLines={1}>{item.file?.name || 'Choose file'}</Text>
                          </TouchableOpacity>
                        ) : (
                          <TextInput className="flex-1 h-10 px-4 py-2 border-t border-b border-gray-300 bg-white" placeholder="Value" value={item.value} onChangeText={(t) => {
                            const next = [...request.formData]
                            next[idx] = { ...next[idx], value: t, type: 'text' }
                            dispatch({ type: 'SET_FORM_DATA', formData: next })
                          }} />
                        )}
                        <TouchableOpacity className="h-10 px-3 bg-red-100 items-center justify-center" onPress={() => handleRemovePair('formData', idx)}>
                          <Ionicons name="trash" size={18} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                      <View className="flex-row">
                        <TouchableOpacity className={`px-3 py-1 rounded-l-lg border ${item.type === 'text' ? 'bg-amber-600 border-amber-600' : 'bg-white border-gray-300'}`} onPress={() => {
                          const next = [...request.formData]
                          next[idx] = { ...next[idx], type: 'text', file: undefined }
                          dispatch({ type: 'SET_FORM_DATA', formData: next })
                        }}>
                          <Text className={`${item.type === 'text' ? 'text-white' : 'text-gray-700'} text-sm`}>Text</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={`px-3 py-1 rounded-r-lg border ${item.type === 'file' ? 'bg-amber-600 border-amber-600' : 'bg-white border-gray-300'}`} onPress={() => {
                          const next = [...request.formData]
                          next[idx] = { ...next[idx], type: 'file' }
                          dispatch({ type: 'SET_FORM_DATA', formData: next })
                        }}>
                          <Text className={`${item.type === 'file' ? 'text-white' : 'text-gray-700'} text-sm`}>File</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity className="mt-2 bg-amber-600 p-3 rounded-lg items-center" onPress={() => handleAddPair('formData')}>
                    <Text className="text-white font-semibold">Add Field</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}

          {request.tab === 'Auth' && (
            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              <View className="flex-row mb-3">
                {(['none','basic','bearer','oauth2','apikey'] as const).map(type => (
                  <TouchableOpacity key={type} onPress={() => dispatch({ type: 'SET_AUTH', auth: type === 'none' ? { type } : type === 'basic' ? { type, username: '', password: '' } : type === 'bearer' ? { type, token: '' } : type === 'oauth2' ? { type, token: '' } : { type, key: '', value: '', location: 'header' } })} className={`px-3 py-2 mr-2 rounded-lg border ${request.auth.type === type ? 'bg-amber-600 border-amber-600' : 'bg-white border-gray-300'}`}>
                    <Text className={`${request.auth.type === type ? 'text-white' : 'text-gray-700'} text-sm capitalize`}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {request.auth.type === 'basic' && (
                <View>
                  <Text className="text-gray-700 mb-1">Username</Text>
                  <TextInput className="h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white mb-3" value={request.auth.username} onChangeText={(t) => dispatch({ type: 'SET_AUTH', auth: { type: 'basic', username: t, password: request.auth.type === 'basic' ? request.auth.password : '' } })} />
                  <Text className="text-gray-700 mb-1">Password</Text>
                  <TextInput className="h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white" value={request.auth.password} secureTextEntry onChangeText={(t) => dispatch({ type: 'SET_AUTH', auth: { type: 'basic', username: request.auth.type === 'basic' ? request.auth.username : '', password: t } })} />
                </View>
              )}

              {request.auth.type === 'bearer' && (
                <View>
                  <Text className="text-gray-700 mb-1">Token</Text>
                  <TextInput className="h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white" value={request.auth.token} onChangeText={(t) => dispatch({ type: 'SET_AUTH', auth: { type: 'bearer', token: t } })} />
                </View>
              )}

              {request.auth.type === 'oauth2' && (
                <View>
                  <Text className="text-gray-700 mb-1">Token</Text>
                  <TextInput className="h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white" value={request.auth.token} onChangeText={(t) => dispatch({ type: 'SET_AUTH', auth: { type: 'oauth2', token: t } })} />
                  <Text className="text-gray-500 mt-2">OAuth 2.0 flow management can be added later.</Text>
                </View>
              )}

              {request.auth.type === 'apikey' && (() => {
                const api = request.auth as Extract<AuthState, { type: 'apikey' }>
                return (
                  <View>
                    <Text className="text-gray-700 mb-1">Key name</Text>
                    <TextInput className="h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white mb-3" value={api.key} onChangeText={(t) => dispatch({ type: 'SET_AUTH', auth: { type: 'apikey', key: t, value: api.value, location: api.location } })} />
                    <Text className="text-gray-700 mb-1">Key value</Text>
                    <TextInput className="h-10 px-4 py-2 border border-gray-300 rounded-lg bg-white mb-3" value={api.value} onChangeText={(t) => dispatch({ type: 'SET_AUTH', auth: { type: 'apikey', key: api.key, value: t, location: api.location } })} />
                    <Text className="text-gray-700 mb-1">Location</Text>
                    <View className="flex-row">
                      {(['header','query'] as const).map(loc => (
                        <TouchableOpacity key={loc} onPress={() => dispatch({ type: 'SET_AUTH', auth: { type: 'apikey', key: api.key, value: api.value, location: loc } })} className={`px-3 py-2 mr-2 rounded-lg border ${api.location === loc ? 'bg-amber-600 border-amber-600' : 'bg-white border-gray-300'}`}>
                          <Text className={`${api.location === loc ? 'text-white' : 'text-gray-700'} text-sm capitalize`}>{loc}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )
              })()}
            </ScrollView>
          )}

          {request.tab === 'Response' && (
            <ScrollView
              className="p-4"
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 70 }}
              showsVerticalScrollIndicator={false}
            >
              {response.loading ? (
                <View className="items-center mt-10">
                  <ActivityIndicator size="large" color="#B45309" />
                  <Text className="text-gray-600 mt-3">Sending request...</Text>
                  <TouchableOpacity className="mt-3 px-4 py-2 bg-gray-200 rounded-lg" onPress={cancelRequest}>
                    <Text className="text-gray-800">Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : response.error ? (
                <View>
                  <Text className="text-red-600 font-semibold mb-2">{response.error}</Text>
                </View>
              ) : (
                <View>
                  {typeof response.status !== 'undefined' && (
                    <View className="mb-3">
                      <Text className="text-lg font-bold text-gray-900">{response.statusText}</Text>
                    </View>
                  )}

                  <Text className="text-gray-900 font-semibold mb-2">Headers</Text>
                  <View className="bg-white border border-gray-200 rounded-lg mb-4">
                    {response.headers.map((h, i) => (
                      <View key={`${h.key}-${i}`} className="flex-row justify-between px-3 py-2 border-b border-gray-100">
                        <Text className="text-gray-700 mr-2" selectable>{h.key}</Text>
                        <Text className="text-gray-900 flex-1 text-right" selectable>{h.value}</Text>
                      </View>
                    ))}
                  </View>

                  <Text className="text-gray-900 font-semibold mb-2">Body</Text>
                  <View className="flex-row mb-2">
                    {(['Pretty','Raw','Preview'] as const).map(v => (
                      <TouchableOpacity key={v} onPress={() => setResponseView(v)} className={`px-3 py-1 mr-2 rounded-lg border ${responseView === v ? 'bg-amber-600 border-amber-600' : 'bg-white border-gray-300'}`}>
                        <Text className={`${responseView === v ? 'text-white' : 'text-gray-700'} text-sm`}>{v}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {responseView === 'Pretty' && (
                    <View className="bg-white border border-gray-200 rounded-lg">
                      <ScrollView nestedScrollEnabled className="max-h-96" contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>
                        <Text selectable className="text-gray-900">{prettyText}</Text>
                      </ScrollView>
                    </View>
                  )}
                  {responseView === 'Raw' && (
                    <View className="bg-white border border-gray-200 rounded-lg">
                      <ScrollView nestedScrollEnabled className="max-h-96" contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>
                        <Text selectable className="text-gray-900">{response.bodyText}</Text>
                      </ScrollView>
                    </View>
                  )}
                  {responseView === 'Preview' && (
                    <View className="bg-white border border-gray-200 rounded-lg">
                      <ScrollView nestedScrollEnabled className="max-h-96" contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>
                        <Text className="text-gray-500">HTML preview is limited on mobile. Render in WebView in future.</Text>
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          )}
        </View>

        {/* Bottom bar */}
        <View className="px-4 py-3 bg-white border-t border-gray-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity className="px-4 py-3 bg-amber-600 rounded-lg items-center justify-center flex-1 mr-2" onPress={sendRequest} disabled={!canSend || response.loading}>
              {response.loading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#fff" />
                  <Text className="text-white font-semibold ml-2">Sending...</Text>
                </View>
              ) : (
                <Text className="text-white font-semibold">Send Request</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-3 bg-gray-200 rounded-lg items-center justify-center" onPress={cancelRequest} disabled={!response.loading}>
              <Text className="text-gray-800 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Method Picker Modal */}
      <Modal visible={showMethodModal} transparent animationType="fade" onRequestClose={() => setShowMethodModal(false)}>
        <TouchableOpacity className="flex-1 bg-black bg-opacity-30 justify-center items-center" activeOpacity={1} onPressOut={() => setShowMethodModal(false)}>
          <View className="bg-white rounded-xl p-4 w-64">
            {METHODS.map(m => (
              <TouchableOpacity key={m} className="py-2" onPress={() => { dispatch({ type: 'SET_METHOD', method: m }); setShowMethodModal(false) }}>
                <Text className="text-gray-900">{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Raw Format Modal */}
      <Modal visible={showFormatModal} transparent animationType="fade" onRequestClose={() => setShowFormatModal(false)}>
        <TouchableOpacity className="flex-1 bg-black bg-opacity-30 justify-center items-center" activeOpacity={1} onPressOut={() => setShowFormatModal(false)}>
          <View className="bg-white rounded-xl p-4 w-64">
            {RAW_FORMATS.map(f => (
              <TouchableOpacity key={f} className="py-2" onPress={() => { dispatch({ type: 'SET_RAW_FORMAT', rawFormat: f }); setShowFormatModal(false) }}>
                <Text className="text-gray-900 uppercase">{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

export default RequestScreen
