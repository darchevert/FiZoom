import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { useApp } from '../lib/state';
import { spacing, theme } from '../lib/theme';

function computeAge(day: number, month: number, year: number): number | null {
  if (!day || !month || !year) return null;
  if (year < 1900 || year > new Date().getFullYear()) return null;
  const dob = new Date(year, month - 1, day);
  if (dob.getMonth() !== month - 1) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
}

export default function AgeGate() {
  const { verifyAge } = useApp();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [rejected, setRejected] = useState(false);

  const age = useMemo(() => computeAge(parseInt(day, 10), parseInt(month, 10), parseInt(year, 10)), [day, month, year]);
  const canSubmit = age !== null;

  const onSubmit = () => {
    if (age === null) return;
    if (age >= 18) {
      verifyAge();
      router.replace('/home');
    } else {
      setRejected(true);
    }
  };

  if (rejected) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
          <Text style={{ fontSize: 48 }}>🔞</Text>
          <Text style={{ color: theme.ink, fontSize: 20, fontWeight: '700', textAlign: 'center' }}>
            Accès refusé
          </Text>
          <Text style={{ color: theme.inkSoft, textAlign: 'center', maxWidth: 320 }}>
            FiZoom contient des références à l’alcool et est réservé aux personnes majeures. Reviens quand tu auras 18 ans.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', gap: spacing.lg }}>
        <View style={{ alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
          <Text style={{ fontSize: 44 }}>🃏</Text>
          <Text style={{ color: theme.ink, fontSize: 24, fontWeight: '800' }}>Vérification d’âge</Text>
          <Text style={{ color: theme.inkSoft, textAlign: 'center', maxWidth: 320 }}>
            FiZoom fait référence à la consommation d’alcool. Indique ta date de naissance pour continuer.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' }}>
          <DateField placeholder="JJ" value={day} onChangeText={setDay} maxLength={2} width={70} />
          <DateField placeholder="MM" value={month} onChangeText={setMonth} maxLength={2} width={70} />
          <DateField placeholder="AAAA" value={year} onChangeText={setYear} maxLength={4} width={100} />
        </View>

        <Button label="Confirmer" onPress={onSubmit} disabled={!canSubmit} />

        <Text style={{ color: theme.inkSoft, fontSize: 12, textAlign: 'center', marginTop: spacing.md }}>
          En continuant, tu acceptes de consommer de l’alcool avec modération.
        </Text>
      </View>
    </Screen>
  );
}

function DateField({
  placeholder,
  value,
  onChangeText,
  maxLength,
  width,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  maxLength: number;
  width: number;
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={theme.inkSoft}
      value={value}
      onChangeText={(v) => onChangeText(v.replace(/[^0-9]/g, ''))}
      keyboardType="number-pad"
      maxLength={maxLength}
      style={{
        width,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        color: theme.ink,
        borderRadius: 10,
        paddingVertical: 12,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
      }}
    />
  );
}
