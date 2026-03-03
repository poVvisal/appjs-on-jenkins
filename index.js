const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let items = [
	{ id: 1, name: 'Apple', category: 'Fruit' },
	{ id: 2, name: 'Broccoli', category: 'Vegetable' },
	{ id: 3, name: 'Milk', category: 'Dairy' },
	{ id: 4, name: 'Bread', category: 'Bakery' },
	{ id: 5, name: 'Eggs', category: 'Dairy' },
];
let nextId = 6;

app.get('/', (req, res) => res.send('Simple API running'));

// List items
app.get('/items', (req, res) => {
	res.json(items);
});


app.listen(port, () => console.log(`Server listening on ${port}`));
