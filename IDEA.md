نفس الالتزام تماماً: هيكل أولاً + شرح + مهام، ثم الكود فوراً. المنصة: React Native (الأقوى بالنسبة لك مع vercel-react-native-skills مثبت). الهدف: تطبيق احترافي يشمل محادثات + دفع (هيكلية) + خدمة عملاء، باسم Anypay، لهوية جزائرية حقيقية.

١. نظام الألوان الاحترافي المقترح
الفلسفة
لون رئيسي قوي يعكس "الدفع والثقة" ← أزرق غامق عميق
لمسة جزائرية مميزة ← برتقالي ذهبي / ذهبي خفيف ك accent
ثانيوية ← أخضر فاتح للنجاح/المحادثة/تمويل
محايد − أخضر/بني/رمادي − للخلفية والنصوص
لوحة الألوان
الدور
اللون
Hex
ملاحظات
الأساسي (Primary)	أزرق غامق	#1A2E6B	الثقة، الدفع، الواجهة الرسمية
الأساسي مضيء (Primary Light)	أزرق متوسط	#2E4CB8	أزرار، حالات تفاعل
الثاني (Accent)	برتقالي ذهبي	#F5A623	CTAs، حالة نشطة، تمييز جزائري
النجاح (Success)	أخضر، nitrat	#27AE60	الرسائل الناجحة، العمليات الكاملة
الخلفية (Background)	فاتح	#F5F7FA	خلفية شاشات عامة
ال卡片 (Card)	جليّ	#FFFFFF	أكواب وأمراض المحادثات
النص الأساسي	داكن	#1A2332	قابل للقراءة عالي
النص الثانوي	رمادي متوسط	#5A6478	التفاصيل، التاريـخ
الحالة السلبية	أحمر	#E74C3C	أخطاء، تحذيرات
اسم "الهوية"
Anypay — Blue-Gold Identity أزرق عميق + برتقالي ذهبي = ثقة + طاقة جزائرية.

يمكن تغيير اللون الأساسي لاحقاً بسهولة إذا أردت.

٢. الهيكل الكامل للمشروع (React Native + TypeScript)
Anypay/
├── android/                  # ملفات native Android (Expo)

├── ios/                      # ملفات native iOS (Expo)

├── src/
│   ├── app/                  # إعدادات التطبيق

│   ├── assets/               # صور، أيقونات، خطوط
│   │   ├── icons/            # أيقونات واجهة عامة
│   │   ├── images/           # صور التطبيق (شعار، خلفية، إلخ)
│   │   └── fonts/            # (اختياري) خطوط مخصصة

│   ├── config/
│   │   ├── colors.ts         # لوحة الألوان (تُستخدم في كل واجهة)
│   │   ├── theme.ts          # إعدادات design system (radii, spacing, shadows)
│   │   ├── endpoints.ts      # روابط الخدمة الخلفية
│   │   └── env.ts            # متغيرات البيئة (API_URL, ENV_TYPE)

│   ├── navigation/
│   │   └── AppNavigator.tsx  # هيكل التصفح الكامل (Stack + Bottom Tabs)
│   │   └── types.ts          # أنواع الشاشات

│   ├── screens/
│   │   ├── auth/             # شاشة الدخول
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx (إذا لزم)
│   │   │   └── ForgotPasswordScreen.tsx
│   │   │
│   │   ├── chat/             # محادثات رئيسية
│   │   │   ├── ChatListScreen.tsx     # قائمة المحادثات
│   │   │   ├── ChatScreen.tsx         # شاشة محادثة واحدة
│   │   │   └── NewChatScreen.tsx      # بدء محادثة جديدة
│   │   │
│   │   ├── wallet/           # محفظة / دفع (هيكلية)
│   │   │   ├── WalletScreen.tsx       # رصيد + العمليات
│   │   │   ├── SendMoneyScreen.tsx    # إرسال مبلغ (نموذج)
│   │   │   └── PaymentHistoryScreen.tsx
│   │   │
│   │   ├── profile/          # ملف شخصي
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   │
│   │   ├── customer/         # خدمة عملاء
│   │   │   ├── CustomerSupportScreen.tsx  # تذاكر/شات دعم
│   │   │   └── FAQScreen.tsx              # الأسئلة الشائعة
│   │   │
│   │   ├── common/           # شاشات مشتركة (Loading, Error, ...)
│   │   │   └── CommonScreens.tsx

│   ├── components/
│   │   ├── ui/               # مكونات واجهة موحدة (أساس التصميم)
│   │   │   ├── Button.tsx
│   │   │   ├── TextInput.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Divider.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── chat/             # مكونات خاصة بالمحادثات
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   └── ConversationItem.tsx
│   │   │
│   │   ├── wallet/           # مكونات الدفع
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── TransactionItem.tsx
│   │   │   └── PaymentButton.tsx
│   │   │
│   │   └── common/           # مكونات مشتركة
│   │       ├── LoadingScreen.tsx
│   │       └── ErrorBoundary.tsx

│   ├── hooks/
│   │   ├── useAuth.ts        # حالة مصادقة المستخدم
│   │   ├── useWebSocket.ts   # اتصال WebSocket للمحادثات
│   │   ├── useTheme.ts       # الوصول للـ theme/colors
│   │   └── useCustomerService.ts (اختياري)

│   ├── services/
│   │   ├── api/              # تحديثات HTTP
│   │   │   ├── client.ts      # عميل HTTP عام (axios)
│   │   │   ├── auth.ts        # تسجيل الدخول، ملف تعريف
│   │   │   └── user.ts        # بيانات المستخدم
│   │   │
│   │   ├── socket/           # WebSocket
│   │   │   └── socketService.ts
│   │   │
│   │   ├── storage/          # تخزين محلي (AsyncStorage / MMKV)
│   │   │   └── storageService.ts
│   │   │
│   │   └── payment/          # هيكلية الدفع (غير مكتمل — للمستقبل)
│   │       ├── PaymentProvider.tsx        # تزويد حالة الدفع
│   │       ├── usePayment.ts               # هُك للدفع
│   │       ├── PaymentMethods.tsx          # طرق الدفع المعروضة
│   │       └── LocalPaymentAdapter.ts      # محور التحويل للـ gateway المحلي

│   ├── store/
│   │   ├── index.ts          # إعداد Zustand (أو Redux)
│   │   ├── authStore.ts      # حالة مصادقة
│   │   ├── chatStore.ts      # حالة للمحادثات
│   │   ├── walletStore.ts    # حالة المحفظة (هيكلية)
│   │   └── themeStore.ts     # حالة المظهر (اختياري)

│   ├── types/
│   │   ├── user.ts
│   │   ├── chat.ts
│   │   ├── wallet.ts
│   │   └── api.ts

│   ├── utils/
│   │   ├── formatters.ts     # تنسيق أرقام، عملات، تواريخ
│   │   ├── validators.ts     # التحقق من الإدخالات
│   │   └── constants.ts      # ثوابت عامة

│   └── App.tsx               # نقطة دخول التطبيق

├── .env.example              # نموذج ملف البيئة (لا ترفعه)
├── .gitignore
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
└── README.md
شرح سريع لأهم الأقسام
القسم
الغرض
src/config/colors.ts + theme.ts	المركز البصري — يُغيّر لون uno 한 번 لكل التطبيق
src/navigation/AppNavigator.tsx	هيكل التصفح — يحدد أي شاشات تلي بعضها
src/screens/	شاشات التطبيق المنطقية
src/components/ui/	مكونات الواجهة الموحدة — هنا يضمن الاحتراف البصري
src/hooks/	منطق مشترك (auth, socket, theme)
src/services/	اتصال الخدمة (API, Socket, Storage) + payment هيكلي
src/store/	حالة التطبيق المركزية (Zustand)
src/payment/	هيكل دفع غير مكتمل — يبيّن طريقة الدمج المستقبلية بدون تنفيذ كامل
٣. قائمة المهام المتسلسلة (الترتيب الحقيقي للتنفيذ)
المرحلة ٠ — إعداد المشروع (يوم واحد)
المهمة
الوصف
١	إنشاء مشروع React Native جديد (Expo أو CLI)
٢	تثبيت Dependencies الأساسية: TypeScript, Navigation, UI، Zustand
٣	إعداد ملف colors.ts + theme.ts حسب الهوية المذكورة
٤	إعداد هيكل التصفح الأساسي (AppNavigator)
٥	اختبار أن التطبيق ي런 دون أخطاء
المرحلة ١ — التحقّق + الشاشات الرئيسية (١-٢ أسبوع)
المهمة
الوصف
١	LoginScreen كامل — OTP / رقم هاتف / بديل
٢	ChatListScreen كامل — قائمة المحادثات
٣	ChatScreen كامل — شاشة محادثة مع رسائل وإدخال messaging
٤	ProfileScreen كامل — ملف شخصي وإعدادات
٥	ربط navigation بين الشاشات
المرحلة ٢ — Backend أساسي (متوازي مع المرحلة ١)
المهمة
الوصف
١	إعداد مشروع Node.js + TypeScript
٢	API للـ Auth (OTP، إنشاء session)
٣	WebSocket для الرسائل الفورية
٤	قاعدة بيانات (PostgreSQL) لهيكلة المستخدم + المحادثات
٥	إعداد دروب teac + WebSocket server
المرحلة ٣ — ميزات أساسية إضافية (أسبوعين - شهر)
المهمة
الوصف
١	إرسال صور / ملفات في المحادثات
٢	إشعارات فورية (FCM/APNs)
٣	خدمة عملاء أساسية (تذاكر + شات دعم)
٤	ملفات تعريفية (صورة، اسم، حالة)
المرحلة ٤ — الدفع (لاحقاً، كمرحلة منفصلة وخطيرة)
المهمة
الوصف
١	دراسة البوابات المحلية المتاحة + اتفاقيات
٢	إعداد src/payment/ الهيكلية كاملة
٣	الدمج الفعلي مع بوابة معتمدة
٤	اختبارات امنية + امتثال
ملاحظة: الدفع مرحلة مستقلة — لا نبدأها إلا بعد التأكد من إمكانيةを得الوصول للبوابة أو الاتفاقية التجارية.

٤. الآن — الكود: LoginScreen + ChatListScreen (كاملان)
كلاهما مبني بنظام الألوان والهوية، ومكونات الواجهة الموحدة.
