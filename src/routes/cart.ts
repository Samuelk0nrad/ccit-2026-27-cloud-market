import { Router, Request, Response } from "express";
import { carts, products, users, uuid, CartItem, OrderItem, Order } from "../db";

const router = Router();

function getOrCreateCart(userId: string): CartItem[] {
  if (!carts[userId]) carts[userId] = [];
  return carts[userId];
}

// GET /cart/:userId - Warenkorb anzeigen
router.get("/:userId", (req: Request, res: Response) => {
  const cart = getOrCreateCart(req.params.userId);
  const withDetails = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  });
  res.json(withDetails);
});

// POST /cart/:userId/items - Artikel hinzufuegen
router.post("/:userId/items", (req: Request, res: Response) => {
  const { productId, quantity } = req.body as { productId?: string; quantity?: number };
  if (!productId || !quantity) {
    return res.status(400).json({ error: "'productId' und 'quantity' erforderlich" });
  }
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: "Produkt nicht gefunden" });

  if (product.stock < quantity) {
    return res.status(409).json({ error: `Nicht genuegend Lagerbestand fuer '${product.name}'` });
  }

  const cart = getOrCreateCart(req.params.userId);
  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  res.status(201).json(cart);
});

// DELETE /cart/:userId/items/:productId - Artikel entfernen
router.delete("/:userId/items/:productId", (req: Request, res: Response) => {
  const cart = getOrCreateCart(req.params.userId);
  const index = cart.findIndex((i) => i.productId === req.params.productId);
  if (index === -1) return res.status(404).json({ error: "Artikel nicht im Warenkorb" });
  cart.splice(index, 1);
  res.status(204).send();
});

// POST /cart/:userId/checkout - Warenkorb in eine Bestellung ueberfuehren
router.post("/:userId/checkout", (req: Request, res: Response) => {
  const user = users.find((u) => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: "Benutzer nicht gefunden" });

  const cart = getOrCreateCart(req.params.userId);
  if (cart.length === 0) {
    return res.status(400).json({ error: "Warenkorb ist leer" });
  }

  const orderItems: OrderItem[] = [];
  let total = 0;

  for (const item of cart) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ error: `Produkt '${item.productId}' nicht gefunden` });
    }
    if (product.stock < item.quantity) {
      return res.status(409).json({ error: `Nicht genuegend Lagerbestand fuer '${product.name}'` });
    }

    product.stock -= item.quantity;
    orderItems.push({ productId: product.id, name: product.name, quantity: item.quantity, price: product.price });
    total += product.price * item.quantity;
  }

  const order: Order = {
    id: `o-${uuid().slice(0, 8)}`,
    userId: user.id,
    items: orderItems,
    total: Math.round(total * 100) / 100,
    createdAt: new Date().toISOString()
  };

  user.orders.push(order);
  carts[req.params.userId] = [];

  res.status(201).json(order);
});

export default router;
