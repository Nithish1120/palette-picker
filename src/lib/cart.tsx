import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type MenuItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  dietary: "veg" | "non-veg";
  image: string;
  moods: string[];
  signature?: boolean;
};

export type CartLine = MenuItem & { quantity: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  taxes: number;
  total: number;
  add: (item: MenuItem) => void;
  setQuantity: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "food-therapy-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore unwritable storage */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const taxes = Math.round(subtotal * 0.05);
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal,
      taxes,
      total: subtotal + taxes,
      add: (item) =>
        setLines((current) =>
          current.some((line) => line.id === item.id)
            ? current.map((line) =>
                line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line,
              )
            : [...current, { ...item, quantity: 1 }],
        ),
      setQuantity: (id, delta) =>
        setLines((current) =>
          current
            .map((line) => (line.id === id ? { ...line, quantity: line.quantity + delta } : line))
            .filter((line) => line.quantity > 0),
        ),
      remove: (id) => setLines((current) => current.filter((line) => line.id !== id)),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
