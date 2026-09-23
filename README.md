# CloudMarket – Monolith (Startcode)

## Lokal starten

```bash
npm install
npm run dev
```

Der Server läuft danach auf `http://localhost:3000`.

Für einen kompilierten Produktionsstart:

```bash
npm run build
npm start
```

## Mit Docker starten

```bash
docker build -t cloudmarket-monolith .
docker run -p 3000:3000 cloudmarket-monolith
```

## API-Überblick

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/health` | Health-Check |
| GET | `/products` | Produktkatalog (optional `?category=...`) |
| GET | `/products/:id` | Einzelnes Produkt |
| PATCH | `/products/:id/stock` | Lagerbestand ändern (`{ "delta": -1 }`) |
| GET | `/cart/:userId` | Warenkorb anzeigen |
| POST | `/cart/:userId/items` | Artikel in Warenkorb legen (`{ "productId": "p-001", "quantity": 1 }`) — prueft Lagerbestand |
| DELETE | `/cart/:userId/items/:productId` | Artikel entfernen |
| POST | `/cart/:userId/checkout` | Warenkorb in Bestellung ueberfuehren (bucht Lager, legt Order beim User an, leert Warenkorb) |
| GET | `/users/:id` | Benutzerprofil (inkl. Bestellhistorie `orders`) |
| POST | `/users` | Registrierung (`{ "username", "email", "password" }`) |
