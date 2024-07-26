const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json({ extended: false }));

app.use('/', require('./routes/index'));
app.use('/game', require('./routes/game'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
  