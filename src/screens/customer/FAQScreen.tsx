import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ViewStyle,
} from 'react-native';
import {colors} from '../../config/colors';
import {borderRadius, spacing, typography, shadows} from '../../config/theme';
import {Header} from '../../components/ui/Header';
import {Card} from '../../components/ui/Card';
import {useNavigation} from '@react-navigation/native';

const faqs = [
  {
    id: '1',
    question: 'كيف أقوم بالتسجيل في Anypay؟',
    answer:
      'قم بتنزيل تطبيق Anypay من متجر التطبيقات، ثم النقر على "إنشاء حساب" وإدخال رقم الهاتف والتحقق عبر رمز OTP المرسل إلى هاتفك.',
  },
  {
    id: '2',
    question: 'كيف أضيف حساباً بنكيًا؟',
    answer:
      'من الشاشة الرئيسية، اضغط على "حساباتي"، ثم "+ إضافة حساب" واختر البنك من القائمة، وأدخل تفاصيل الحساب كما هو م-requested.',
  },
  {
    id: '3',
    question: 'ما هي رسوم التحويل؟',
    answer:
      "تختلف الرسوم حسب نوع التحويل والوجهة وسرعة الإنجاز. يمكنك معرفة الرسوم الدقيقة قبل إتمام أي عملية من شاشة التحويل.",
  },
  {
    id: '4',
    question: 'كيف أبلغ عن مشكلة أو استرداد أمر؟',
    answer:
      'انتقل إلى الإعدادات > الدعم الفني، واختر نوع المشكلة، ثم ارفق لقطات الشاشة والأدلة إذا لزم الأمر. فريق الدعم سيرد خلال 24 ساعة.',
  },
  {
    id: '5',
    question: 'هل يمكنني استخدام Anypay دون اتصال بالإنترنت؟',
    answer:
      'نعم، يمكنك عرض رصيدك وقائمة التحويلات السابقة دون اتصال. ولكن لإرسال أو استقبال أموال، يجب أن يكون هناك اتصال نشط بالإنترنت.',
  },
];

export const FAQScreen: React.FC = () => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const navigation = useNavigation();

  const toggle = (idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  const toggleAll = () => {
    setExpandedIdx(expandedIdx === null ? 0 : null);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        title="الأسئلة الشائعة"
        leftIcon={<Text style={{fontSize: 18, color: '#fff'}}>←</Text>}
        leftAction={() => navigation.goBack()}
        rightIcon={
          <TouchableOpacity onPress={toggleAll} style={styles.headerRight}>
            <Text style={styles.headerRightText}>
              {expandedIdx !== null ? 'إخفاء الكل' : 'عرض الكل'}
            </Text>
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {faqs.map((faq, globalIdx) => {
          const open = expandedIdx === globalIdx;
          return (
            <Card
              key={globalIdx}
              style={[styles.faqCard, open && styles.faqCardOpen]}
              noShadow>
              <TouchableOpacity
                style={styles.faqRow}
                onPress={() => toggle(globalIdx)}
                activeOpacity={0.7}>
                <View style={styles.faqIconContainer}>
                  <Text style={styles.faqIcon}>{open ? '−' : '+'}</Text>
                </View>
                <View style={styles.faqTextContainer}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                </View>
              </TouchableOpacity>
              {open && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  headerRight: {
    marginRight: spacing.md,
  },
  headerRightText: {
    color: colors.primary,
    fontWeight: '600',
  },
  faqCard: {
    marginBottom: spacing.md,
  },
  faqCardOpen: {
    marginBottom: spacing.md,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  faqIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  faqIcon: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqTextContainer: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  faqAnswerContainer: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  faqAnswer: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
