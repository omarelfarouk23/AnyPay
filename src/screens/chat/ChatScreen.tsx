import React, {useCallback, useRef, useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert} from 'react-native';
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
import {conversationService} from '../../services/api/conversation';
import {emitMessage, emitTyping, emitRead} from '../../services/socket/socketService';
import {Conversation, Message} from '../../types/chat';
import NetInfo from '@react-native-community/netinfo';

interface ChatScreenProps {
  route: {params: {conversationId: string}};
  navigation: any;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({route, navigation}) => {
  const {conversationId} = route.params;
  const {colors: themeColors} = useTheme();
  const {user} = useAuthStore();
  const chatStore = useChatStore();
  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatStore.connectSocket();
    chatStore.setActiveConversation({id: conversationId} as Conversation);
    loadMessages();
    chatStore.markConversationRead(conversationId);
  }, [conversationId]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const messages = await conversationService.getMessages(conversationId);
      chatStore.setMessages(messages);
    } catch (err) {
      console.error('[ChatScreen] Failed to load messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendText = useCallback(async () => {
    if (!inputText.trim() || sending) return;
    const newMsg = { conversationId, content: inputText.trim(), type: 'text' as const, timestamp: new Date().toISOString() };
    if (!isOnline) {
      // Queue message for later
      chatStore.addPendingMessage(newMsg);
      // Optimistic add
      const optimisticMsg: Message = {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId: user?.id ?? 'current_user',
        sender: { id: user?.id ?? 'current_user', fullName: user?.fullName ?? 'أنت', status: 'active' },
        content: inputText.trim(),
        type: 'text',
        createdAt: new Date().toISOString(),
        readBy: [],
        status: 'sent',
      };
      chatStore.addMessage(optimisticMsg);
      setInputText('');
      return;
    }
    setSending(true);
    emitTyping(conversationId, false);
    try {
      const newMessage = await conversationService.sendMessage(conversationId, inputText.trim());
      chatStore.addMessage(newMessage);
      setInputText('');
      emitMessage(conversationId, {content: newMessage.content, type: 'text', senderId: user?.id ?? 'current_user'});
      emitRead(conversationId);
      setTimeout(() => flatListRef.current?.scrollToEnd({animated: true}), 100);
    } catch (err) {
      console.error('[ChatScreen] Failed to send message:', err);
      // Queue on failure
      chatStore.addPendingMessage(newMsg);
    } finally {
      setSending(false);
    }
  }, [inputText, sending, conversationId, user, isOnline]);

  const handleSendAttachment = useCallback(async (file: AttachmentFile) => {
    if (!isOnline) {
      Alert.alert('لا اتصال بالإنترنت', 'ستُرسل الرسالة عند الاتصال');
      chatStore.addPendingMessage({
        conversationId,
        content: `📎 ${file.name}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        attachment: { uri: file.uri, type: file.type, fileName: file.name, size: file.size },
        timestamp: new Date().toISOString(),
      });
      return;
    }
    setSending(true);
    emitTyping(conversationId, false);
    try {
      const newMessage = await conversationService.sendMessageWithAttachment(conversationId, {uri: file.uri, type: file.type, fileName: file.name, size: file.size});
      chatStore.addMessage(newMessage);
      emitMessage(conversationId, {content: `📎 ${file.name}`, type: file.type.startsWith('image/') ? 'image' : 'file', senderId: user?.id ?? 'current_user', attachment: {uri: file.uri, type: file.type, fileName: file.name, size: file.size}});
      emitRead(conversationId);
      setTimeout(() => flatListRef.current?.scrollToEnd({animated: true}), 100);
    } catch (err) {
      console.error('[ChatScreen] Failed to send attachment:', err);
    } finally {
      setSending(false);
    }
  }, [conversationId, user, isOnline]);

  // Typing indicator
  const handleTypingChange = useCallback((isTyping: boolean) => {
    emitTyping(conversationId, isTyping);
  }, [conversationId]);

  const handleSend = useCallback(async (content: string, attachment?: AttachmentFile) => {
    if (!content.trim() && !attachment) return;
    if (attachment) { await handleSendAttachment(attachment); } else { setInputText(content); await handleSendText(); }
  }, [handleSendText, handleSendAttachment]);

  const keyExtractor = useCallback((item: Message) => item.id, []);
  const renderItem = useCallback(
    ({item}: {item: Message}) => (
      <View style={[styles.messageRow, item.senderId === user?.id && styles.messageRowOutgoing]}>
        <MessageBubble text={item.content} type={item.type} attachment={item.attachment} outgoing={item.senderId === user?.id} timestamp={new Date(item.createdAt).toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})} status={item.status === 'failed' ? undefined : item.status} />
      </View>
    ),
    [user?.id],
  );

  const onEndReached = useCallback(() => { loadMessages(); }, []);
  const onRefresh = useCallback(async () => { await loadMessages(); }, [conversationId]);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: themeColors.background}]} edges={['bottom']}>
      <Header
        title="المحادثة"
        subtitle={loadingMessages ? 'جاري التحميل...' : `${chatStore.messages.length} رسالة`}
        leftIcon={<Icon name="arrowLeft" size={22} color={colors.textOnPrimary} />}
        leftAction={() => navigation.goBack()}
        rightIcon={<TouchableOpacity onPress={() => navigation.navigate('ChatInfo', {conversationId})}><Icon name="info" size={20} color={colors.textOnPrimary} /></TouchableOpacity>}
        backgroundColor={colors.primary} tintColor={colors.textOnPrimary} style={styles.header}
      />
      {!isOnline && <View style={styles.offlineBanner}><Text style={styles.offlineText}>⚠️ أنت خارج الشبكة — الرسائل ستُرسل عند الاتصال</Text></View>}
      {chatStore.isTyping && <View style={styles.typingIndicator}><Text style={styles.typingText}>يكتب...</Text></View>}
      <FlatList
        ref={flatListRef} data={chatStore.messages} keyExtractor={keyExtractor} renderItem={renderItem}
        onEndReached={onEndReached} onEndReachedThreshold={0.3} contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<View style={styles.emptyState}><Icon name="chatCircle" size={48} color={colors.textTertiary} /><Text style={styles.emptyTitle}>لا توجد رسائل بعد</Text><Text style={styles.emptySubtitle}>ابدأ المحادثة في الأسفل</Text></View>}
        refreshControl={<RefreshControl refreshing={loadingMessages} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
      />
      <ChatInput value={inputText} onChangeText={setInputText} onSend={handleSend} placeholder="أكتب رسالة..." sendIcon={<Icon name="paperPlane" size={18} color={colors.textOnPrimary} />} maxLength={2000} disabled={sending} />
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
  offlineBanner: {
    backgroundColor: '#FF6B35',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: typography.md,
    fontWeight: typography.weights.medium,
  },
  typingIndicator: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  typingText: {
    fontSize: typography.sm,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
});
