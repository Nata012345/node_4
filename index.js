const  express = require('express');
const { filmsRouter } = require('./routers/films');

const app = express();
const PORT = 3000;

app.use(express.json());
app.get('', (req, res) => {
    res.send('Hello World!!!');
})
app.use('/getTop250', filmsRouter);
app.use('/api', filmsRouter);

app.listen(PORT, () => {
    console.log('Example app listening on port 3000!');
})
