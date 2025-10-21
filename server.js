const express = require('express');
const connectDB = require('./config/db');

//Initialise Express
const app = express();

//Connect MongoDB

connectDB();

app.get('/', (req, res) => res.send('API Running'));

// //Define Routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth' , require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));