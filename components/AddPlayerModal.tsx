import React, { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Button } from './Button';
import { radius, spacing, theme } from '../lib/theme';

export function AddPlayerModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}) {
  const [name, setName] = useState('');

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name);
    setName('');
    onClose();
  };

  const cancel = () => {
    setName('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={cancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
        <View
          style={{
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.bg,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: radius.lg,
            padding: spacing.lg,
          }}
        >
          <Text style={{ color: theme.ink, fontSize: 18, fontWeight: '800', marginBottom: spacing.sm }}>
            Ajouter un joueur
          </Text>
          <Text style={{ color: theme.inkSoft, fontSize: 13, marginBottom: spacing.md }}>
            Il rejoint la partie en cours, juste après le joueur actuel.
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            onSubmitEditing={submit}
            autoFocus
            placeholder="Prénom du joueur"
            placeholderTextColor={theme.inkSoft}
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.surface,
              color: theme.ink,
              borderRadius: radius.sm,
              paddingHorizontal: spacing.md,
              paddingVertical: 12,
              marginBottom: spacing.lg,
            }}
          />
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Pressable onPress={cancel} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 }}>
              <Text style={{ color: theme.inkSoft, fontWeight: '700' }}>Annuler</Text>
            </Pressable>
            <Button label="Ajouter" onPress={submit} disabled={!name.trim()} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
