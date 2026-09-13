// src/screens/chat/NewChatScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { colors, spacing, borderRadius, typography } from '../../config/theme';
import { validatePhoneNumber } from '../../utils/validators';

export const NewChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const handleStartChat = () => {
    if (!selectedContact) {
      Alert.alert('اختر جهة اتصال', 'يرجى اختيار جهة للبدء بالمحادثة.');
      return;
    }
    navigation.navigate('ChatDetail', { conversationId: `new_${selectedContact}` });
  };

  const mockContacts = [
    { id: 'c1', name: 'أحمد عبد الله', phone: '0555123456' },
    { id: 'c2', name: 'سارة السعود', phone: '0555234567' },
    { id: 'c3', name: 'عبد الرحمن محمد', phone: '0555345678' },
    { id: 'c4', name: 'فاطمة بنت شورى', phone: '0555456789' },
    { id: 'c5', name: 'خالد فاروق', phone: '0555567890' },
  ];

  const filteredContacts = mockContacts.filter((c) =>
    c.name.includes(searchQuery) || c.phone.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ العودة</Text>
        </TouchableOpacity>
        <Text style={styles.title}>محادثة جديدة</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Text style={styles.searchPlaceholder}>#</Text>
          <TextInput
            style={styles.searchInputField}
            placeholder="ابحث عن جهة اتصال..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.list}>
        {filteredContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            onPress={() => setSelectedContact(contact.id)}
            activeOpacity={0.7}
          >
            <Avatar name={contact.name} size={48} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
            {selectedContact === contact.id && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title={selectedContact ? 'بدء محادثة' : 'اختر جهة اتصال'}
          onPress={handleStartChat}
          disabled={!selectedContact}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  backText: { fontSize: typography.sizes.md, color: colors.primary, fontWeight: '500' },
  title: { flex: 1, fontSize: typography.sizes.lg, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  searchContainer: { padding: spacing.md, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.divider },
  searchInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: 10, borderWidth: 1, borderColor: colors.border },
  searchPlaceholder: { color: colors.textSecondary, fontWeight: '700', marginRight: spacing.sm },
  searchInputField: { flex: 1, fontSize: typography.sizes.md, color: colors.textPrimary },
  list: { flex: 1 },
  contactItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  contactInfo: { flex: 1, marginLeft: spacing.md },
  contactName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.textPrimary },
  contactPhone: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 2 },
  checkmark: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  checkmarkText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  footer: { padding: spacing.lg, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.divider },
});
