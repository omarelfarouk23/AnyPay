import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput as RNTextInput, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Avatar} from '../../components/ui/Avatar';
import {Icon} from '../../components/ui/Icon';
import {Card} from '../../components/ui/Card';
import {useTheme} from '../../hooks/useTheme';

const FAQS = [
  {
    question: 'كيف أعرف رصيدي؟',
    answer: 'انتقل إلى تبويب "المحفظة" لمعاينة رصيدك المتاح والكلّي.',
  },
  {
    question: 'كيف أرسل أموالًا لصديق؟',
    answer: 'من تبويب "المحفظة"، اضغط على "إرسال"، أدخل رقم الهاتف وكمية المبلغ ووصفًا اختياريًا.',
  },
  {
    question: 'ما هي رسوم التحويل؟',
    answer: 'التحويلات الداخلية مجانية تمامًا. التحويلات الدولية تخضع لرسوم طبقاً للانتقالات البنكية.',
  },
  {
    question: 'كيف أبلغ عن مشكلة؟',
    answer: 'من تبويب "خدمة العملاء"، يمكنك مراسلتنا مباشرة، أو إنشاء تذكرة دعم.',
  },
  {
    question: 'ما هي مدة التحويل؟',
    answer: 'التحويلات تتم عادةً خلال دقائق، ولكن قد تستغرق حتى 24 ساعة في الحالات الاستثنائية.',
  },
  {
    question: 'كيف يمكنني حماية حسابي؟',
    answer: 'استخدم كلمة مرور قوية، فعّل المصادقة الثنائية، ولا تشارك كودات التحقق مع أحد.',
  },
];

export const CustomerSupportScreen: React.FC = () => {
  const {colors: themeColors} = useTheme();
  const [messages, setMessages] = useState<{text: string; sender: 'user' | 'support'}[]>([]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setMessages((prev) => [...prev, {text, sender: 'user'}]);
    setInputText('');
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <Header
        title="خدمة العملاء"
        leftIcon={<Text style={styles.backText}>←</Text>}
        leftAction={() => {}}
        backgroundColor={colors.primary}
        tintColor={colors.textOnPrimary}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Direct chat */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تواصل مباشر</Text>
          <Card style={styles.chatCard}>
            <View style={styles.chatHeader}>
              <Avatar name="دعم فني" size={36} />
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatHeaderName}>فريق الدعم  24/7</Text>
                <Text style={styles.chatHeaderStatus}>متواجد الآن</Text>
              </View>
            </View>
            <View style={styles.chatBubbleContainer}>
              {messages.map((msg, i) => (
                <View
                  key={i}
                  style={[
                    styles.bubble,
                    {backgroundColor: msg.sender === 'user' ? colors.primary : colors.surfaceElevated},
                    msg.sender === 'user' && styles.userBubble,
                  ]}>
                  <Text style={[styles.bubbleText, {color: msg.sender === 'user' ? colors.textOnPrimary : colors.textPrimary}]}>
                    {msg.text}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputBox, {backgroundColor: colors.surfaceElevated}]}>
                <RNTextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="اكتب رسالتك..."
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  maxLength={200}
                />
              </View>
              <TouchableOpacity
                style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={!inputText.trim()}>
                <Text style={[styles.sendBtnText, !inputText.trim() && styles.sendBtnTextDisabled]}>
                  إرسال
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* FAQ accordion */}
        <Text style={styles.sectionTitle}>الأسئلة الشائعة</Text>
        {FAQS.map((faq, i) => (
          <Card key={i} style={styles.faqCard}>
            <TouchableOpacity style={styles.faqRow}>
              <Text style={styles.faqQ}>{faq.question}</Text>
              <Icon name="chevronDown" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
            <Text style={styles.faqA}>{faq.answer}</Text>
          </Card>
        ))}

        {/* Contact info */}
        <Text style={styles.sectionTitle}>معلومات التواصل</Text>
        <View style={styles.contactRow}>
          <Icon name="phone" size={20} color={colors.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>الهاتف</Text>
            <Text style={styles.contactValue}>+213 555 12 34 56</Text>
          </View>
        </View>
        <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
        <View style={styles.contactRow}>
          <Icon name="email" size={20} color={colors.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>البريد الإلكتروني</Text>
            <Text style={styles.contactValue}>support@anypay.dz</Text>
          </View>
        </View>
        <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
        <View style={styles.contactRow}>
          <Icon name="globe" size={20} color={colors.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>الموقع</Text>
            <Text style={styles.contactValue}>https://anypay.dz</Text>
          </View>
        </View>
        <View style={[styles.divider, {backgroundColor: colors.borderLight}]} />
        <View style={styles.contactRow}>
          <Icon name="location" size={20} color={colors.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>العنوان</Text>
            <Text style={styles.contactValue}>الجزائر، الجزائر العاصمة</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backText: {
    fontSize: 24,
    color: colors.textOnPrimary,
    lineHeight: 24,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  chatCard: {
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: typography.md,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  chatHeaderStatus: {
    fontSize: typography.xs,
    color: colors.success,
    marginTop: 2,
  },
  chatBubbleContainer: {
    padding: spacing.md,
    minHeight: 100,
    maxHeight: 160,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  bubble: {
    maxWidth: '80%',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: typography.sm,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  inputBox: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: typography.md,
    color: colors.textPrimary,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    minWidth: 80,
  },
  sendBtnDisabled: {
    backgroundColor: colors.surfaceElevated,
  },
  sendBtnText: {
    fontSize: typography.md,
    fontWeight: '500',
    color: colors.textOnPrimary,
  },
  sendBtnTextDisabled: {
    color: colors.textTertiary,
  },
  faqCard: {
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  faqQ: {
    flex: 1,
    fontSize: typography.md,
    fontWeight: '500',
    color: colors.primary,
    lineHeight: 22,
  },
  faqA: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    padding: spacing.md,
    paddingTop: 0,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
