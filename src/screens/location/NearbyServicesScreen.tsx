import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { colors } from '../../config/colors';
import { borderRadius, spacing, typography, shadows } from '../../config/theme';
import { Header } from '../../components/ui/Header';
import { Icon } from '../../components/ui/Icon';
import { useTheme } from '../../hooks/useTheme';
import { locationService } from '../../services/api/locationService';
import type { Location as LocationType } from '../../types/location';

type PlaceType = 'atm' | 'bank' | 'store' | 'pharmacy' | 'restaurant';

const PLACE_TYPES: { key: PlaceType; label: string }[] = [
  { key: 'atm', label: 'صراف آلي' },
  { key: 'bank', label: 'بنك' },
  { key: 'store', label: 'متجر' },
  { key: 'pharmacy', label: 'صيدلية' },
  { key: 'restaurant', label: 'مطعم' },
];

export const NearbyServicesScreen: React.FC = () => {
  const { colors: themeColors } = useTheme();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedType, setSelectedType] = useState<PlaceType>('atm');
  const [places, setPlaces] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const current = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: current.coords.latitude, longitude: current.coords.longitude });
    } catch {
      setLocation({ latitude: 36.75, longitude: 3.05 });
    }
  }, []);

  const loadNearby = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    try {
      const data = await locationService.findNearbyPlaces(location.latitude, location.longitude, selectedType);
      setPlaces(data);
    } catch {
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [location, selectedType]);

  useEffect(() => { loadLocation(); }, []);
  useEffect(() => { if (location) loadNearby(); }, [location, selectedType]);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'atm': return '🏧'; case 'bank': return '🏦'; case 'store': return '🏪';
      case 'pharmacy': return '💊'; case 'restaurant': return '🍽️'; default: return '📍';
    }
  };

  const renderPlace = ({ item }: { item: LocationType }) => (
    <TouchableOpacity style={styles.placeCard} activeOpacity={0.7}>
      <View style={styles.placeIcon}><Text style={styles.placeIconText}>{typeIcon(item.type)}</Text></View>
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeAddress} numberOfLines={1}>{item.address}</Text>
        <Text style={styles.placeDistance}>{item.distance}م</Text>
      </View>
      <View style={styles.placeActions}>
        <TouchableOpacity style={styles.placeActionBtn}><Icon name="phone" size={18} color={colors.primary} /></TouchableOpacity>
        <TouchableOpacity style={styles.placeActionBtn}><Icon name="directions" size={18} color={colors.primary} /></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="الخدمات القريبة" leftIcon={<Text style={styles.backText}>←</Text>} leftAction={() => {}} backgroundColor={colors.primary} tintColor={colors.textOnPrimary} />
      <FlatList horizontal data={PLACE_TYPES} keyExtractor={(item) => item.key} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeSelector} renderItem={({ item }) => {
        const active = selectedType === item.key;
        return (
          <TouchableOpacity style={[styles.typeChip, active && styles.typeChipActive]} onPress={() => setSelectedType(item.key)}>
            <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      }} />
      {loading ? <ActivityIndicator size="large" color={colors.primary} style={styles.loader} /> : (
        <FlatList data={places} keyExtractor={(item) => item.id} renderItem={renderPlace} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.emptyText}>لا توجد نتائج قريبة</Text>} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backText: { fontSize: 18, color: '#fff' },
  typeSelector: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  typeChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.lg, backgroundColor: colors.card, marginLeft: spacing.sm, borderWidth: 1, borderColor: colors.border },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChipText: { fontSize: typography.sm, color: colors.textSecondary },
  typeChipTextActive: { color: colors.textOnPrimary },
  loader: { marginTop: spacing.xl },
  list: { padding: spacing.md },
  placeCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, backgroundColor: colors.card, borderRadius: borderRadius.md, marginBottom: spacing.md, ...shadows.sm },
  placeIcon: { width: 48, height: 48, borderRadius: borderRadius.md, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center' },
  placeIconText: { fontSize: 24 },
  placeInfo: { flex: 1, marginLeft: spacing.md },
  placeName: { fontSize: typography.md, fontWeight: typography.weights.semibold, color: colors.onSurface },
  placeAddress: { fontSize: typography.sm, color: colors.textSecondary, marginTop: 2 },
  placeDistance: { fontSize: typography.xs, color: colors.primary, marginTop: 4 },
  placeActions: { flexDirection: 'row', gap: spacing.sm },
  placeActionBtn: { padding: spacing.xs },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
