'use client';

import { create } from 'zustand';
import { MenuItem, ModifierOption } from '@/data/menu';

export type CartModifiers = Record<string, string | boolean>;

export type CartItem = {
  cartId: string; // unique key per item+modifier combo
  item: MenuItem;
  quantity: number;
  selectedModifiers: CartModifiers;
  modifierPrice: number; // extra cost from modifiers
};

export type OrderType = 'dine-in' | 'pickup' | 'delivery';

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  orderType: OrderType;
  tableNumber: string;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (table: string) => void;
  addItem: (item: MenuItem, modifiers: CartModifiers, modifierPrice: number) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

function buildCartId(itemId: string, modifiers: CartModifiers): string {
  const modStr = Object.entries(modifiers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return `${itemId}__${modStr}`;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  orderType: 'pickup',
  tableNumber: '',

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  setOrderType: (orderType) => set({ orderType }),
  setTableNumber: (tableNumber) => set({ tableNumber }),

  addItem: (item, selectedModifiers, modifierPrice) => {
    const cartId = buildCartId(item.id, selectedModifiers);
    set((state) => {
      const existing = state.items.find((i) => i.cartId === cartId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { cartId, item, quantity: 1, selectedModifiers, modifierPrice },
        ],
      };
    });
  },

  removeItem: (cartId) =>
    set((state) => ({ items: state.items.filter((i) => i.cartId !== cartId) })),

  updateQuantity: (cartId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.cartId === cartId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () =>
    get().items.reduce(
      (sum, i) => sum + (i.item.price + i.modifierPrice) * i.quantity,
      0
    ),
}));
