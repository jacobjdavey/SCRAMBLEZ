const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000; // May need to change PORT to something else if 3000 is already in use

app.use(cors());

let score = 0;

app.get('/hello', (req, res) => {
    res.send('hello world!');
});

app.get('/score', (req, res) => {
    res.send(`${score}`);
});

app.patch('/score', (req, res) => {
    score += parseInt(req.query.val);
    res.status(200).send(`${score}`);
})

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});