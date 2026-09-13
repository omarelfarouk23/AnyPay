export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Chat: {conversationId: string; conversationTitle: string};
};

export type TabParamList = {
  ChatList: undefined;
  Wallet: undefined;
  Profile: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  Chat: {conversationId: string; conversationTitle: string};
};

export type WalletStackParamList = {
  WalletHome: undefined;
  SendMoney: undefined;
  TransactionHistory: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Settings: undefined;
};
