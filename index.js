const  express = require('express');
const { createLog } = require('./helpers/createLog')
const { checkAuthHeader } = require('./routers/checkAuthHeader');
const { filmsRouter } = require('./routers/films');
const { authsRouter } = require('./routers/api');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(createLog);
app.use(checkAuthHeader);
app.use('/getTop250', filmsRouter);
app.use('/api', filmsRouter);
app.use('/api', authsRouter);

app.listen(PORT, () => {
    console.log('Example app listening on port 3000!');
})
