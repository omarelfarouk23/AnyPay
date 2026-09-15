import type {MerchantInfo} from '../types/payment';

// Trusted merchants shown on the scanner screen (Stitch design: تجار موثوقون)
export const TRUSTED_MERCHANTS: MerchantInfo[] = [
  {
    id: 'm-saada',
    name: 'متجر السعادة',
    nameFr: 'Supermarché El-Saada',
    location: 'الجزائر الوسطى',
    ccpId: '00284918',
    isVerified: true,
    icon: '🏪',
    suggestedAmount: 1250,
  },
  {
    id: 'm-pharma',
    name: 'صيدلية ابن سينا',
    nameFr: 'Pharmacie Ibn Sina',
    location: 'وهران',
    ccpId: '00914210',
    isVerified: true,
    icon: '💊',
    suggestedAmount: 480,
  },
];

export const QUICK_AMOUNTS = [500, 1000, 2000, 5000];