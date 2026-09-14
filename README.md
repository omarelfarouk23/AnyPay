# Anypay

تطبيق دفع إلكتروني متنقل — الهوية الزرقاء والذهبية الجزائرية 🇩🇿

## الهوية البصرية

| العنصر | القيمة |
|--------|--------|
| اللون الأساسي | `#1A2E6B` (الأزرق الجزائري) |
| اللون التكميلي | `#F5A623` (الذهبي الجزائري) |
| الخط | System (الخط النظامي) |
| القطع |丸 |국경 |دائري|

## المتطلبات المسبوقة

- Node.js 18+
- npm 9+
- Expo CLI: `npm install -g expo-cli`
- Android Studio (للاندرويد)
- Xcode (لل아이오س، opting Mac only)

## التثبيت

```bash
npm install
```

## التشغيل المحلي

```bash
# تشغيل المطور (المتصفح/المحاكي)
npm start

# الأندرويد
npm run android

# الآيفون
npm run ios

# الويب
npm run web
```

## اختبار الوحدة

```bash
npm test           # تشغيل كل الاختبارات
npm run test:watch # وضع المراقبة
npm run test:coverage # مع تغطية الكود
```

## البناء باستخدام EAS

```bash
# تثبيت EAS CLI (أول مرة)
npm install -g eas-cli

# بناء للتطوير
eas build --profile development --platform android

# بناء للمعاينة
eas build --profile preview --platform all

# بناء للإنتاج
eas build --profile production --platform all
```

## المتغيرات البيئية

أنشئ ملف `.env` في الجذر مع المتغيرات التالية:

```env
EXPO_PUBLIC_API_BASE_URL=https://api.anypay.dz/v1
EXPO_PUBLIC_WS_URL=wss://ws.anypay.dz
EXPO_PUBLIC_FCM_SERVER_KEY=your_fcm_key
EXPO_PUBLIC_APNS_TEAM_ID=your_team_id
EXPO_PUBLIC_APNS_BUNDLE_ID=com.anypay.app
EXPO_PUBLIC_ENVIRONMENT=development
```

> **ملاحظة أمنية:** لا تُدرج قيم حساسة في الكود. استخدم `process.env.EXPO_PUBLIC_*` فقط.

## الهيكل

```
src/
├── config/         # Theme, Colors, Endpoints, Env
├── types/          # TypeScript interfaces & types
├── utils/          # Helpers (validators, formatters, mediaPicker)
├── hooks/          # Custom React hooks
├── store/          # Zustand state stores
├── services/       # API, Socket, Push Notifications, Payment
├── components/     # Reusable UI components
├── screens/        # Application screens
├── navigation/     # React Navigation setup
└── App.tsx         # Entry point
```

## المساهمة

1. فرع جديد: `git checkout -b feat/feature-name`
2. التعديل والاختبار
3. التأكد من `npm run test` و `npx tsc --noEmit`
4. طلب مراجعة الكود (PR)

## الترخيص

حقوق النشر © 2026 Anypay. جميع الحقوق محفوظة.
