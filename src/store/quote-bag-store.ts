import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuoteItem {
  productId: string;
  name: string;
  slug?: string;
  sku?: string | null;
  modelNumber?: string;
  category?: string;
  image?: string;
  quantity: number;
  notes?: string;
}

export interface QuoteBagState {
  items: QuoteItem[];
  isDrawerOpen: boolean;
  addItem: (item: Omit<QuoteItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemNotes: (productId: string, notes: string) => void;
  clearBag: () => void;
  setDrawerOpen: (open: boolean) => void;
  totalCount: () => number;
}

export const useQuoteBagStore = create<QuoteBagState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.max(1, quantity) },
            ],
          };
        });
      },
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },
      updateItemNotes: (productId: string, notes: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, notes } : i,
          ),
        }));
      },
      clearBag: () => {
        set({ items: [] });
      },
      setDrawerOpen: (open: boolean) => {
        set({ isDrawerOpen: open });
      },
      totalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "elpima_quote_bag",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);

export const useQuoteBag = useQuoteBagStore;

