export function formatDateAlgerian(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ];

  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  if (days === 0) {
    return `اليوم، ${day} ${month}`;
  }
  if (days === 1) {
    return `أمس، ${dayName}`;
  }
  if (days < 7) {
    return `${dayName} الماضي`;
  }
  return `${dayName}، ${day} ${month} ${year}`;
}

export function formatTimeAlgerian(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ar-DZ', {hour: '2-digit', minute: '2-digit'});
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'قبل ثانية';
  if (minutes < 60) return `قبل ${minutes} دقيقة`;
  if (hours < 24) return `قبل ${hours} ساعة`;
  if (days < 7) return `قبل ${days} يوم`;
  return formatDateAlgerian(dateString);
}

export function formatCurrency(amount: number, currencyCode: string = 'DZD'): string {
  try {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: currencyCode === 'DA' ? 'DZD' : currencyCode,
    }).format(amount);
  } catch {
    return `${amount} DA`;
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ar-DZ').format(value);
}
