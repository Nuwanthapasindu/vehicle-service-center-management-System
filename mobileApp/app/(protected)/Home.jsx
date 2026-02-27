import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import useAuthentication from '../../hooks/useAuth'

export default function Home() {
  const {logout} = useAuthentication()
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text>Home</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}