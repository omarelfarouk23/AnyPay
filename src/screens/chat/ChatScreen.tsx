import React, {useCallback, useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Icon} from '../../components/ui/Icon';
import {ChatInput} from '../../components/chat/ChatInput';
import {AttachmentFile} from '../../components/chat/AttachmentPicker';
import {MessageBubble} from '../../components/chat/MessageBubble';
import {useChatStore} from '../../store/chatStore';
import {useAuthStore} from '../../store/authStore';
import {useTheme} from '../../hooks/useTheme';
import {Conversation, Message} from '../../types/chat';

interface ChatScreenProps {
  route: {
    params: {
      conversation: Conversation;
    };
  };
  navigation: any;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({route, navigation}) => {
  const {conversation} = route.params;
  const {colors: themeColors} = useTheme();
  const {user} = useAuthStore();
  const chatStore = useChatStore();

  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    chatStore.setActiveConversation(conversation);
  }, [conversation, chatStore]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || sending) return;
    setSending(true);
    try {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId: conversation.id,
        senderId: user?.id ?? 'current_user',
        sender: {
          id: user?.id ?? 'current_user',
          fullName: user?.fullName ?? 'أنت',
          avatarUrl: user?.avatarUrl,
          status: 'active',
        },
        content: inputText.trim(),
        type: 'text',
        createdAt: new Date().toISOString(),
        readBy: [],
        status: 'sent',
      };
      chatStore.addMessage(newMessage);
      setInputText('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    } catch (error) {
      console.error('ChatScreen: failed to send message', error);
    } finally {
      setSending(false);
    }
  }, [inputText, sending, conversation.id, user, chatStore]);

  const handleAttachment = useCallback((file: AttachmentFile) => {
    console.log('Attachment selected:', file.name, file.type, file.uri);
  }, []);

  const keyExtractor = useCallback((item: Message) => item.id, []);
  const renderItem = useCallback(
    ({item}: {item: Message}) => (
      <View
        style={[
          styles.messageRow,
          item.senderId === user?.id && styles.messageRowOutgoing,
        ]}
      >
        <MessageBubble
          text={item.content}
          outgoing={item.senderId === user?.id}
          timestamp={new Date(item.createdAt).toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          status={item.status === 'failed' ? undefined : item.status}
        />
      </View>
    ),
    [user?.id],
  );

  const getItemLayout = useCallback(
    (data: ArrayLike<any> | null | undefined, index: number) => ({
      length: 70,
      offset: 70 * index,
      index,
    }),
    [],
  );

  const onEndReached = useCallback(() => {
    console.log('[ChatScreen] End reached, loading more messages...');
  }, []);

  const onRefresh = useCallback(async () => {
    console.log('[ChatScreen] Refreshing messages...');
    setTimeout(() => {
      console.log('[ChatScreen] Refresh complete');
    }, 1000);
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: themeColors.background}]}
      edges={['bottom']}>
      <Header
        title={conversation.title}
        subtitle={conversation.lastMessage?.content}
        leftIcon={<Icon name="arrowLeft" size={22} color={colors.textOnPrimary} />}
        leftAction={() => navigation.goBack()}
        rightIcon={
          <TouchableOpacity onPress={() => console.log('Chat info pressed')}>
            <Icon name="info" size={20} color={colors.textOnPrimary} />
          </TouchableOpacity>
        }
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
        style={styles.header}
      />

      <FlatList
        ref={flatListRef}
        data={chatStore.messages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="chatCircle" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>لا توجد رسائل بعد</Text>
            <Text style={styles.emptySubtitle}>ابدأ المحادثة في الأسفل</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        onAttachment={handleAttachment}
        placeholder="أكتب رسالة..."
        sendIcon={<Icon name="paperPlane" size={18} color={colors.textOnPrimary} />}
        maxLength={2000}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 0,
    shadowOpacity: 0,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 8,
  },
  messageRow: {
    marginBottom: spacing.xs,
  },
  messageRowOutgoing: {
    marginLeft: 'auto',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontWeight: typography.weights.medium,
  },
  emptySubtitle: {
    fontSize: typography.md,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
