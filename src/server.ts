import express from "express";

import productsRouter from "./routes/products";
import cartRouter from "./routes/cart";
import usersRouter from "./routes/users";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "cloudmarket-monolith" }));

app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`CloudMarket-Monolith laeuft auf Port ${PORT}`);
  console.log(`Health-Check: http://localhost:${PORT}/health`);
});
