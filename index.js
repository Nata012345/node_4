const  express = require('express');
const { checkAuthHeader } = require('./routers/checkAuthHeader');
const { filmsRouter } = require('./routers/films');
const { authsRouter } = require('./routers/api');

const app = express();
const PORT = 3000;

app.use(express.json());
// app.get('', (req, res) => {
//     res.send('Hello World!!!');
// })

app.use(checkAuthHeader);
app.use('/getTop250', filmsRouter);
app.use('/api', filmsRouter);
app.use('/api', authsRouter);

app.listen(PORT, () => {
    console.log('Example app listening on port 3000!');
})
