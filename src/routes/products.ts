import { Router, Request, Response } from "express";
import { products } from "../db";

const router = Router();

// GET /products - Katalog auflisten (optional gefiltert nach Kategorie)
router.get("/", (req: Request, res: Response) => {
  const { category } = req.query;
  const result = category
    ? products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase())
    : products;
  res.json(result);
});

// GET /products/:id - einzelnes Produkt
router.get("/:id", (req: Request, res: Response) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Produkt nicht gefunden" });
  res.json(product);
});

// PATCH /products/:id/stock - Lagerbestand aendern (z.B. bei Bestellung)
router.patch("/:id/stock", (req: Request, res: Response) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Produkt nicht gefunden" });

  const { delta } = req.body;
  if (typeof delta !== "number") {
    return res.status(400).json({ error: "'delta' (number) erforderlich" });
  }

  const newStock = product.stock + delta;
  if (newStock < 0) {
    return res.status(409).json({ error: "Nicht genuegend Lagerbestand" });
  }

  product.stock = newStock;
  res.json(product);
});

export default router;
