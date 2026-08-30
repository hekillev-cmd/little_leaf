export const DEMO_PAYMENT_ADDRESS = "TQ9k...L3AF · عنوان تجريبي فقط";

export const PAYMENT_ADDRESSES = {
  BEP20: "0x525aA8d9E33a5193985490D871b154209Bf801f7",
  TRC20: "TD8y8sdVXHweLijpTitWnhoResJhvTdFiF",
  ERC20: "0x525aA8d9E33a5193985490D871b154209Bf801f7",
  SOL: "2eCoA9BHVaSzdVqRH7jmjsosF7puqtkXeYJ7bpw89syj",
  ARB: "0x525aA8d9E33a5193985490D871b154209Bf801f7",
} as const;

export const getPaymentAddress = (network: keyof typeof PAYMENT_ADDRESSES) => PAYMENT_ADDRESSES[network];

export const getUsdtAmount = (usdTotal: number) => usdTotal;

export const getDemoConfirmationMessage = (network: string) =>
  `تم تسجيل الدفع المحاكي عبر شبكة ${network}. في المتجر الحقيقي، سيصل رابط التحميل إلى البريد الإلكتروني بعد التحقق من المعاملة.`;

export const getCheckoutRedirectPath = (itemCount: number) => itemCount === 0 ? "/cart" : null;

export const createDemoPaymentConfirmation = (network: string) => ({
  confirmed: true,
  network,
  message: getDemoConfirmationMessage(network),
});
