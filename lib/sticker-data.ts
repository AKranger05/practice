export interface Sticker {
  id: string
  name: string
  price: number
  category: "syrup-based" | "milk-based" | "laddoo-specials" | "festive-favorites"
  emoji: string
  image?: string // Optional image URL - takes priority over emoji when provided
}

export const stickers: Sticker[] = [
  // Syrup Based
  { id: "jalebi", name: "Jalebi", price: 25, category: "syrup-based", emoji: "🥨" },
  { id: "gulab-jamun", name: "Gulab Jamun", price: 30, category: "syrup-based", emoji: "🟤" },
  { id: "rasgulla", name: "Rasgulla", price: 28, category: "syrup-based", emoji: "⚪" },
  { id: "imarti", name: "Imarti", price: 26, category: "syrup-based", emoji: "🌸" },
  { id: "balushahi", name: "Balushahi", price: 24, category: "syrup-based", emoji: "🍩" },
  { id: "cham-cham", name: "Cham Cham", price: 32, category: "syrup-based", emoji: "🍬" },
  
  // Milk Based
  { id: "rasmalai", name: "Rasmalai", price: 35, category: "milk-based", emoji: "🥛" },
  { id: "kheer", name: "Kheer", price: 22, category: "milk-based", emoji: "🍚" },
  { id: "rabri", name: "Rabri", price: 28, category: "milk-based", emoji: "🥣" },
  { id: "malai-peda", name: "Malai Peda", price: 30, category: "milk-based", emoji: "🟡" },
  { id: "sandesh", name: "Sandesh", price: 26, category: "milk-based", emoji: "🧁" },
  { id: "kalakand", name: "Kalakand", price: 32, category: "milk-based", emoji: "🍰" },
  
  // Laddoo Specials
  { id: "motichoor", name: "Motichoor Laddoo", price: 28, category: "laddoo-specials", emoji: "🟠" },
  { id: "besan", name: "Besan Laddoo", price: 24, category: "laddoo-specials", emoji: "🌕" },
  { id: "coconut", name: "Coconut Laddoo", price: 26, category: "laddoo-specials", emoji: "🥥" },
  { id: "rava", name: "Rava Laddoo", price: 25, category: "laddoo-specials", emoji: "🔵" },
  { id: "dry-fruit", name: "Dry Fruit Laddoo", price: 40, category: "laddoo-specials", emoji: "🥜" },
  { id: "boondi", name: "Boondi Laddoo", price: 22, category: "laddoo-specials", emoji: "🟡" },
  
  // Festive Favorites
  { id: "kaju-katli", name: "Kaju Katli", price: 45, category: "festive-favorites", emoji: "💎" },
  { id: "samosa", name: "Samosa", price: 15, category: "festive-favorites", emoji: "🔺" },
  { id: "gujiya", name: "Gujiya", price: 28, category: "festive-favorites", emoji: "🥟" },
  { id: "malpua", name: "Malpua", price: 30, category: "festive-favorites", emoji: "🥞" },
  { id: "kachori", name: "Kachori", price: 18, category: "festive-favorites", emoji: "🥯" },
  { id: "namkeen", name: "Namkeen", price: 20, category: "festive-favorites", emoji: "🥨" },
]

export const trendingStickers = stickers.slice(0, 6)

export const categories = [
  { id: "syrup-based", name: "Syrup Based" },
  { id: "milk-based", name: "Milk Based" },
  { id: "laddoo-specials", name: "Laddoo Specials" },
  { id: "festive-favorites", name: "Festive Favorites" },
] as const
