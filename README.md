# Simple API

This is a minimal Express API to test add (POST), update (PUT), and delete (DELETE) operations on an in-memory `items` list.

Run:

```powershell
npm install
npm start
```

Endpoints:

- `GET /items` — list items
- `POST /items` — add item, JSON body `{ "name": "..." }`
- `PUT /items/:id` — update item name, JSON body `{ "name": "..." }`
- `DELETE /items/:id` — delete item

Examples (PowerShell):

```powershell
Invoke-RestMethod -Uri http://localhost:3000/items -Method Post -ContentType 'application/json' -Body '{"name":"apple"}'
Invoke-RestMethod -Uri http://localhost:3000/items -Method Get
Invoke-RestMethod -Uri http://localhost:3000/items/1 -Method Put -ContentType 'application/json' -Body '{"name":"banana"}'
Invoke-RestMethod -Uri http://localhost:3000/items/1 -Method Delete
```
