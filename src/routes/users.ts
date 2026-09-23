import { Router, Request, Response } from "express";
import { users, uuid } from "../db";

const router = Router();

// GET /users/:id - Benutzerprofil (ohne sensible Felder)
router.get("/:id", (req: Request, res: Response) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "Benutzer nicht gefunden" });
  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

// POST /users - Registrierung (stark vereinfacht, NICHT produktionsreif!)
router.post("/", (req: Request, res: Response) => {
  const { username, email, password } = req.body as { username?: string; email?: string; password?: string };
  if (!username || !email || !password) {
    return res.status(400).json({ error: "'username', 'email' und 'password' erforderlich" });
  }
  if (users.some((u) => u.username === username)) {
    return res.status(409).json({ error: "Benutzername bereits vergeben" });
  }

  const newUser = {
    id: `u-${uuid().slice(0, 8)}`,
    username,
    email,
    passwordHash: `plaintext:${password}`,
    orders: []
  };
  users.push(newUser);
  const { passwordHash, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

export default router;
