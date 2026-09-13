// index.js — نقطة دخول Expo الرسمية
// يجب استخدام registerRootComponent حتى يعرف Expo ما الذي يُرضُع
import { registerRootComponent } from 'expo';
import App from './App';

// تسجيل 컴포넌نت الجذر مع Expo — هذا مطلوب لكل مشروع Expo
registerRootComponent(App);
