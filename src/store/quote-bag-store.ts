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
  updatedAt: number;
  addItem: (item: Omit<QuoteItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemNotes: (productId: string, notes: string) => void;
  clearBag: () => void;
  setDrawerOpen: (open: boolean) => void;
  totalCount: () => number;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const useQuoteBagStore = create<QuoteBagState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      updatedAt: Date.now(),
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId,
          );
          if (existing) {
            return {
              updatedAt: Date.now(),
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return {
            updatedAt: Date.now(),
            items: [
              ...state.items,
              { ...item, quantity: Math.max(1, quantity) },
            ],
          };
        });
      },
      removeItem: (productId: string) => {
        set((state) => ({
          updatedAt: Date.now(),
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          updatedAt: Date.now(),
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },
      updateItemNotes: (productId: string, notes: string) => {
        set((state) => ({
          updatedAt: Date.now(),
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, notes } : i,
          ),
        }));
      },
      clearBag: () => {
        set({ items: [], updatedAt: Date.now() });
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
        updatedAt: state.updatedAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Invalidate bags older than 7 days to prevent ordering deactivated/removed equipment
        if (state.updatedAt && Date.now() - state.updatedAt > SEVEN_DAYS_MS) {
          state.items = [];
          state.updatedAt = Date.now();
        }
      },
    },
  ),
);

export const useQuoteBag = useQuoteBagStore;

