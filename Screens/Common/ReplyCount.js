import React, { useState, useEffect } from 'react'
import { View, Text, Image } from 'react-native'

const ReplyCount = ({ count }) => {
  useEffect(() => {}, [count])
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginBottom: 10
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>댓글 </Text>
        <Text style={{ fontSize: 16, color: '#4A26F4' }}>{count || 0}</Text>
      </View>
    </>
  )
};

export default ReplyCount
