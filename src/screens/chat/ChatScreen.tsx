import React, {useEffect, useRef, useCallback, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Avatar} from '../../components/ui/Avatar';
import {Icon} from '../../components/ui/Icon';
import {ChatInput} from '../../components/chat/ChatInput';
import {ConversationItem} from '../../components/chat/ConversationItem';
import {MessageBubble} from '../../components/chat/MessageBubble';
import {useChatStore} from '../../store/chatStore';
import {useTheme} from '../../hooks/useTheme';
import {Conversation, Message} from '../../types/chat';

interface ChatScreenProps {
  conversation: Conversation;
  onBack?: () => void;
  onSendMessage?: (content: string) => Promise<void>;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({conversation, onBack, onSendMessage}) => {
  const flatListRef = useRef<FlatList>(null);
  const {messages, addMessage, setSending, isSending, setActiveConversation, activeConversation} = useChatStore();
  const {colors: themeColors} = useTheme();
  const [inputText, setInputText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    setActiveConversation(conversation);
  }, [conversation, setActiveConversation]);

  useEffect(() => {
    const showSubscription = Keyboard !== undefined
      ? Keyboard.addListener('keyboardWillShow', () => {
          setIsKeyboardVisible(true);
        })
      : undefined;
    const hideSubscription = Keyboard !== undefined
      ? Keyboard.addListener('keyboardWillHide', () => {
          setIsKeyboardVisible(false);
        })
      : undefined;
    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isSending) return;
    setSending(true);
    try {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId: conversation.id,
        senderId: 'current_user',
        sender: {id: 'current_user', fullName: 'أنت', avatarUrl: undefined, status: 'active'},
        content: inputText.trim(),
        type: 'text',
        createdAt: new Date().toISOString(),
        readBy: [],
        status: 'sent',
      };
      addMessage(newMessage);
      if (onSendMessage) {
        await onSendMessage(inputText.trim());
      }
      setInputText('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    } catch (error) {
      console.error('ChatScreen: failed to send message', error);
    } finally {
      setSending(false);
    }
  }, [inputText, isSending, conversation.id, addMessage, onSendMessage, setSending, setInputText]);

  const keyExtractor = useCallback((item: Message) => item.id, []);
  const renderItem = useCallback(({item}: {item: Message}) => {
    const isOutgoing = item.senderId === 'current_user';
    return (
      <MessageBubble
        text={item.content}
        outgoing={isOutgoing}
        timestamp={new Date(item.createdAt).toLocaleTimeString('ar-US', {hour: '2-digit', minute: '2-digit'})}
        status={item.status}
        style={isOutgoing ? {marginLeft: 'auto'} : {marginRight: 'auto'}}
      />
    );
  }, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 80,
    offset: 80 * index,
    index,
  }), []);

  const onEndReached = useCallback(() => {
    console.log('ChatScreen: end reached, load more messages if needed');
  }, []);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: themeColors.background}]}>
      <Header
        title={conversation.title}
        subtitle={conversation.lastMessage?.content}
        leftIcon={<Text style={styles.backIcon}>←</Text>}
        leftAction={onBack}
        rightIcon={<Icon name="info" size={20} color={colors.textOnPrimary} />}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          getItemLayout={getItemLayout}
          contentContainerStyle={[
            styles.messageList,
            messages.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyMessage}>
              <Icon name="chat" size={48} color={colors.textTertiary} />
              <Text style={styles.emptyMessageText}>بدء محادثة جديدة</Text>
              <Text style={styles.emptyMessageSubtext}>أرسل أول رسالة الآن</Text>
            </View>
          }
        />
        <View style={[styles.inputContainer, isKeyboardVisible && styles.inputContainerKeyboard]}>
          <ChatInput
            value={inputText}
            onChangeText={setInputText}
            onSend={handleSend}
            maxLength={2000}
            placeholder="أكتب رسالة..."
            sendIcon={<Icon name="send" size={18} color={colors.textOnPrimary} />}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  backIcon: {
    fontSize: 24,
    color: colors.textOnPrimary,
    lineHeight: 24,
  },
  messageList: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    alignItems: 'center',
  },
  emptyMessageText: {
    fontSize: typography.lg,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyMessageSubtext: {
    fontSize: typography.md,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  inputContainer: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingBottom: spacing.sm,
  },
  inputContainerKeyboard: {
    paddingBottom: 0,
  },
});
