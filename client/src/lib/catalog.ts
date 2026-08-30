export type Product = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  category: string;
  tag: string;
  cover: string;
  accent: string;
  pages: string;
  description: string;
  details: string[];
};

export type AffiliateProduct = {
  id: string;
  title: string;
  description: string;
  label: string;
  price: string;
  accent: string;
  href: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "little-garden",
    title: "حديقة الألوان الصغيرة",
    subtitle: "كتاب تلوين هادئ",
    price: 7.5,
    category: "كتب التلوين",
    tag: "الأكثر طلباً",
    cover: "garden",
    accent: "coral",
    pages: "28 صفحة",
    description: "رحلة لطيفة بين الزهور والفراشات والحيوانات الصغيرة، مصممة لتمنح الطفل وقتاً هادئاً مليئاً بالألوان.",
    details: ["ملف PDF عالي الجودة", "مقاس A4 جاهز للطباعة", "مناسب من 3 إلى 7 سنوات"],
  },
  {
    id: "draw-with-nour",
    title: "ارسم مع نور",
    subtitle: "خطوات الرسم الأولى",
    price: 9.9,
    category: "دفاتر الرسم",
    tag: "جديد",
    cover: "draw",
    accent: "mint",
    pages: "32 صفحة",
    description: "دروس قصيرة ومرحة تساعد الطفل على بناء أشكال بسيطة ثم تحويلها إلى شخصيات ومشاهد من خياله.",
    details: ["تمارين تدريجية سهلة", "مساحات واسعة للرسم", "مناسب من 5 إلى 9 سنوات"],
  },
  {
    id: "rainy-day-box",
    title: "صندوق يوم ممطر",
    subtitle: "أنشطة منزلية متنوعة",
    price: 6.25,
    category: "أنشطة منزلية",
    tag: "باقة موفّرة",
    cover: "rainy",
    accent: "lavender",
    pages: "24 صفحة",
    description: "باقة من المتاهات والألغاز والقص واللصق لتبقى لحظات المنزل ممتعة حتى في الأيام الممطرة.",
    details: ["24 نشاطاً للطباعة", "نسخة ملونة وأخرى اقتصادية", "مناسب من 4 إلى 8 سنوات"],
  },
  {
    id: "animal-letters",
    title: "حروف وحيوانات",
    subtitle: "بطاقات تعليمية مرحة",
    price: 5.0,
    category: "بطاقات تعليمية",
    tag: "تعلم باللعب",
    cover: "letters",
    accent: "yellow",
    pages: "30 بطاقة",
    description: "بطاقات لطيفة تربط الحرف العربي بصورة حيوان، لتصبح المراجعة اليومية لحظة لعب محببة.",
    details: ["بطاقات قابلة للقص", "ألوان واضحة للطباعة المنزلية", "مناسب من 3 إلى 6 سنوات"],
  },
  {
    id: "space-adventure",
    title: "مغامرة في الفضاء",
    subtitle: "تلوين واكتشاف",
    price: 8.75,
    category: "كتب التلوين",
    tag: "خيال واسع",
    cover: "space",
    accent: "blue",
    pages: "26 صفحة",
    description: "كتاب يأخذ الطفل في جولة بين الكواكب والنجوم والصواريخ مع أسئلة صغيرة تفتح باب الفضول.",
    details: ["رسومات كبيرة وواضحة", "حقائق مبسطة للأطفال", "مناسب من 5 إلى 9 سنوات"],
  },
  {
    id: "my-first-stickers",
    title: "ملصقاتي الأولى",
    subtitle: "صفحات قص ولصق",
    price: 4.5,
    category: "أنشطة منزلية",
    tag: "وقت هادئ",
    cover: "stickers",
    accent: "peach",
    pages: "18 صفحة",
    description: "مشاهد صغيرة مع ملصقات قابلة للطباعة تساعد الطفل على ابتكار قصته وترتيب عالمه الخاص.",
    details: ["قوالب قص بسيطة", "يُفضّل ورق سميك", "مناسب من 3 إلى 6 سنوات"],
  },
];

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: "watercolor-set",
    title: "ألوان مائية لطيفة",
    description: "عدة ألوان مائية مناسبة لبدايات الرسم في المنزل.",
    label: "أداة مقترحة",
    price: "من 12.90 $",
    accent: "mint",
    href: "https://www.etsy.com/",
  },
  {
    id: "desk-organizer",
    title: "منظّم مكتب صغير",
    description: "ترتيب بسيط للأقلام والأوراق بجانب مساحة الإبداع.",
    label: "اختيار عملي",
    price: "من 18.00 $",
    accent: "yellow",
    href: "https://www.amazon.com/",
  },
  {
    id: "reusable-mat",
    title: "بساط رسم قابل للمسح",
    description: "سطح مريح للرسم والأنشطة اليومية دون فوضى كبيرة.",
    label: "لوقت أطول",
    price: "من 21.50 $",
    accent: "lavender",
    href: "https://www.amazon.com/",
  },
];

export const CATEGORIES = [
  { slug: "كتب-التلوين", label: "كتب التلوين", icon: "✦", color: "coral" },
  { slug: "دفاتر-الرسم", label: "دفاتر الرسم", icon: "✎", color: "mint" },
  { slug: "أنشطة-منزلية", label: "أنشطة منزلية", icon: "☼", color: "yellow" },
  { slug: "بطاقات-تعليمية", label: "بطاقات تعليمية", icon: "♡", color: "lavender" },
];

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;

export const findProduct = (id: string | undefined) => PRODUCTS.find((product) => product.id === id);

export const getProductsForCategory = (slug: string | undefined) => {
  const category = CATEGORIES.find((item) => item.slug === slug);
  if (!category) return PRODUCTS;
  return PRODUCTS.filter((product) => product.category === category.label);
};

export const searchProducts = (query: string) => {
  const normalized = query.trim().toLocaleLowerCase("ar");
  if (!normalized) return [];
  return PRODUCTS.filter((product) => `${product.title} ${product.subtitle} ${product.category} ${product.description}`.toLocaleLowerCase("ar").includes(normalized));
};

export const getCartTotal = (cart: Record<string, number>) =>
  PRODUCTS.reduce((total, product) => total + product.price * (cart[product.id] || 0), 0);

export const getCartCount = (cart: Record<string, number>) =>
  Object.values(cart).reduce((total, quantity) => total + quantity, 0);
