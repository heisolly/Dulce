export type ModifierOption = {
  label: string;
  value: string;
  price?: number;
};

export type Modifier = {
  id: string;
  name: string;
  type: 'select' | 'checkbox';
  options: ModifierOption[];
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isFavorite?: boolean;
  emoji?: string;
  modifiers?: Modifier[];
  image_url?: string;
};

export const MENU_ITEMS: MenuItem[] = [
  // ════════════════════ BAKERY ════════════════════
  {
    id: 'churro-cookies',
    name: 'Churro Cookies',
    price: 3500,
    description: 'The satisfying crack of a cinnamon-sugar crust that gives way to a ridiculously soft, warm, buttery center. It’s pure nostalgia in every bite.',
    category: 'bakery',
    isFavorite: true,
    emoji: '🍪',
  },
  {
    id: 'almond-croissant',
    name: 'Almond Croissant',
    price: 4200,
    description: 'Flaky, golden layers filled with rich almond cream and topped with toasted slivered almonds. Baked fresh every morning.',
    category: 'bakery',
    emoji: '🥐',
  },
  {
    id: 'cinnamon-roll',
    name: 'Cinnamon Roll',
    price: 3800,
    description: 'A pillowy soft roll swirled with brown butter & cinnamon, finished with a generous cream cheese glaze.',
    category: 'bakery',
    emoji: '🌀',
  },
  {
    id: 'banana-bread',
    name: 'Banana Bread',
    price: 3200,
    description: 'Moist chocolate-chip banana bread made with overripe bananas and a touch of vanilla. A slice of pure comfort.',
    category: 'bakery',
    emoji: '🍌',
  },
  {
    id: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    price: 4500,
    description: 'Buttery puff pastry wrapped around two pieces of dark chocolate. Perfectly caramelised on the outside.',
    category: 'bakery',
    emoji: '🍫',
  },
  {
    id: 'lemon-tart',
    name: 'Lemon Curd Tart',
    price: 4000,
    description: 'A crisp shortcrust pastry shell filled with silky tangy lemon curd and adorned with fresh lemon zest.',
    category: 'bakery',
    emoji: '🍋',
  },

  // ════════════════════ BRUNCH ════════════════════
  {
    id: 'pesto-chicken-sandwich',
    name: 'Pesto Chicken Sandwich',
    price: 7500,
    description: 'That first audible crunch of toasted sourdough melts instantly into creamy burrata, tender chicken, and beautifully herbaceous pesto. A vibrant pop of flavor that lingers long after you finish.',
    category: 'brunch',
    isFavorite: true,
    emoji: '🥪',
    modifiers: [
      {
        id: 'extra-sauce',
        name: 'Extra Sauce',
        type: 'checkbox',
        options: [{ label: 'Add extra pesto sauce', value: 'extra-pesto', price: 300 }],
      },
    ],
  },
  {
    id: 'avocado-toast',
    name: 'Smashed Avocado Toast',
    price: 6000,
    description: 'Creamy smashed avocado on thick-cut sourdough with pickled red onions, everything bagel seasoning, chilli flakes, and a poached egg.',
    category: 'brunch',
    emoji: '🥑',
    modifiers: [
      {
        id: 'extra-sauce',
        name: 'Extra Sauce',
        type: 'checkbox',
        options: [{ label: 'Add chilli lime drizzle', value: 'chilli-lime', price: 200 }],
      },
    ],
  },
  {
    id: 'shakshuka',
    name: 'Shakshuka',
    price: 6500,
    description: 'Eggs poached in a spiced smoky tomato and bell pepper sauce, topped with crumbled feta, fresh herbs, and served with warm pita.',
    category: 'brunch',
    emoji: '🍳',
  },
  {
    id: 'dulce-waffles',
    name: 'Dulce Waffles',
    price: 7000,
    description: 'Crispy Belgian-style waffles served with seasonal berries, whipped cream, honeycomb butter and a lavender-infused maple syrup.',
    category: 'brunch',
    isFavorite: true,
    emoji: '🧇',
  },
  {
    id: 'eggs-benny',
    name: 'Eggs Benedict',
    price: 7800,
    description: 'Classic Eggs Benedict with smoked salmon, wilted spinach, and a silky house hollandaise on a toasted English muffin.',
    category: 'brunch',
    emoji: '🥚',
  },
  {
    id: 'granola-bowl',
    name: 'Granola & Yoghurt Bowl',
    price: 5000,
    description: 'Toasted honey-oat granola layered with coconut yoghurt, mixed berry compote, seasonal fresh fruit and a drizzle of raw honey.',
    category: 'brunch',
    emoji: '🫙',
  },

  // ════════════════════ COFFEE & DRINKS ════════════════════
  {
    id: 'flat-white',
    name: 'Flat White',
    price: 3500,
    description: 'A smooth, velvety double ristretto shot topped with silky steamed micro-foam milk. The discerning coffee lover\'s choice.',
    category: 'coffee',
    isFavorite: true,
    emoji: '☕',
    modifiers: [
      {
        id: 'milk-choice',
        name: 'Milk Choice',
        type: 'select',
        options: [
          { label: 'Full Cream', value: 'full-cream' },
          { label: 'Oat Milk', value: 'oat', price: 500 },
          { label: 'Almond Milk', value: 'almond', price: 500 },
        ],
      },
    ],
  },
  {
    id: 'latte',
    name: 'Café Latte',
    price: 3200,
    description: 'A generous espresso base balanced with steamed milk and a delicate layer of frothy milk foam. Comforting and creamy.',
    category: 'coffee',
    emoji: '🥛',
    modifiers: [
      {
        id: 'milk-choice',
        name: 'Milk Choice',
        type: 'select',
        options: [
          { label: 'Full Cream', value: 'full-cream' },
          { label: 'Oat Milk', value: 'oat', price: 500 },
          { label: 'Almond Milk', value: 'almond', price: 500 },
        ],
      },
    ],
  },
  {
    id: 'espresso',
    name: 'Espresso',
    price: 2500,
    description: 'A bold, concentrated shot of single-origin Ethiopian espresso with notes of dark chocolate and stone fruit.',
    category: 'coffee',
    emoji: '☕',
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    price: 4000,
    description: 'Ceremonial-grade Japanese matcha whisked smooth and paired with your choice of steamed milk. Earthy, sweet, and vibrant.',
    category: 'coffee',
    emoji: '🍵',
    modifiers: [
      {
        id: 'milk-choice',
        name: 'Milk Choice',
        type: 'select',
        options: [
          { label: 'Full Cream', value: 'full-cream' },
          { label: 'Oat Milk', value: 'oat', price: 500 },
          { label: 'Almond Milk', value: 'almond', price: 500 },
        ],
      },
    ],
  },
  {
    id: 'fresh-lemonade',
    name: 'Fresh Lemonade',
    price: 2800,
    description: 'House-squeezed lemonade with a hint of fresh mint and a touch of honey. Light, refreshing and perfectly balanced.',
    category: 'coffee',
    emoji: '🍋',
  },
  {
    id: 'signature-iced-latte',
    name: 'Signature Iced Latte',
    price: 4200,
    description: 'A dark, intense ribbon of single-origin espresso cascading into a cool rush of milk, sweetened just enough by a whisper of vanilla. Your ultimate afternoon reset.',
    category: 'coffee',
    emoji: '🧋',
    modifiers: [
      {
        id: 'milk-choice',
        name: 'Milk Choice',
        type: 'select',
        options: [
          { label: 'Full Cream', value: 'full-cream' },
          { label: 'Oat Milk', value: 'oat', price: 500 },
          { label: 'Almond Milk', value: 'almond', price: 500 },
        ],
      },
    ],
  },
];

export const CATEGORIES = [
  { id: 'bakery', label: 'Bakery', emoji: '🥐' },
  { id: 'brunch', label: 'Brunch', emoji: '🍳' },
  { id: 'coffee', label: 'Coffee & Drinks', emoji: '☕' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
