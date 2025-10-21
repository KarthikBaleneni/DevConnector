const express = require('express');
const connectDB = require('./config/db');

//Initialise Express
const app = express();

//Connect MongoDB

connectDB();

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));