import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Avatar} from '../../components/ui/Avatar';
import {Icon} from '../../components/ui/Icon';
import {Badge} from '../../components/ui/Badge';
import {useChatStore} from '../../store/chatStore';
import {useTheme} from '../../hooks/useTheme';
import {Conversation} from '../../types/chat';
import {formatDateAlgerian} from '../../utils/formatters';

interface ChatListScreenProps {
  onSelectConversation?: (conversation: Conversation) => void;
}

export const ChatListScreen: React.FC<ChatListScreenProps> = ({onSelectConversation}) => {
  const {conversations, setLoading, isLoading} = useChatStore();
  const {colors: themeColors} = useTheme();

  const renderItem = ({item}: {item: Conversation}) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => onSelectConversation?.(item)}
      activeOpacity={0.7}>
      <Avatar
        uri={item.avatarUrl}
        name={item.title}
        size={50}
        showOnline={!!item.isTyping}
        online={item.isTyping}
      />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.conversationTime}>
            {formatDateAlgerian(item.updatedAt)}
          </Text>
        </View>
        <Text style={styles.conversationSubtitle} numberOfLines={1}>
          {item.lastMessage?.content ?? 'بدء محادثة جديدة'}
        </Text>
        {item.unreadCount > 0 && (
          <Badge variant="accent">{item.unreadCount}</Badge>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Icon name="search" size={20} color={colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>ابحث عن محادثات...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="menu" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.tabText}>جميع</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabTextInactive}>غير مقروءة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabTextInactive}>الأرشفة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="chat" size={48} color={colors.textTertiary} />
      <Text style={styles.emptyTitle}>لا توجد محادثات</Text>
      <Text style={styles.emptySubtitle}>ابدأ محادثة جديدة للتواصل</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Header
        title="المحادثات"
        rightIcon={<Icon name="plus" size={22} color={colors.textOnPrimary} />}
        rightAction={() => {}}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: typography.md,
    color: colors.textTertiary,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryAlpha,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.md,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  tabTextInactive: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  conversationContent: {
    flex: 1,
    marginLeft: spacing.md,
    minWidth: 0,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  conversationTitle: {
    fontSize: typography.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  conversationTime: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    flexShrink: 0,
  },
  conversationSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: typography.md,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
