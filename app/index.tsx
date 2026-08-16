import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useApp } from '../lib/state';
import { theme } from '../lib/theme';

export default function Index() {
  const { hydrated, ageVerified } = useApp();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Text style={{ fontSize: 40 }}>🃏</Text>
        <ActivityIndicator color={theme.gold} />
      </View>
    );
  }

  return <Redirect href={ageVerified ? '/home' : '/age-gate'} />;
}
