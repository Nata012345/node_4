const axios = require("axios");
const express = require('express');
const filmsRouter = express.Router();
const fs = require("fs");
const fileToPath = './files/top250.json';

let movies = [];
const url = 'https://api.kinopoisk.dev/v1.4/movie?page=1&limit=250&selectFields=id&selectFields=name&selectFields=year&selectFields=rating&selectFields=budget&selectFields=poster&notNullFields=id&sortField=id&sortField=name&sortType=1&sortType=-1&type=movie&token=0VQXHBN-5JMMWFP-GWRJC8N-Z7JKC3P';

function writeFile(path, arr) {
    fs.writeFile(path, JSON.stringify(arr, null, 4),(err) => {
        if (err) {
            console.error('Error of writing movies file:', err);
        } else {
            console.log('File movies successfully created');
        }
    });
}
filmsRouter.get('/', async(req, res) => {
    try {
        const response = await axios.get(url);
        const responseFilms = response.data.docs;

        let i = 0
        movies = responseFilms.map( item => {
            i += 1
            return {
                id: i,
                title: item.name,
                rating: item.rating.imdb.toString(),
                year: item.year,
                budget: item.budget?.value ?? 0,
                gross: "Undefiend",
                poster: item.poster.url,
                position: item.id
            }
        })
        writeFile(fileToPath, movies);
        res.status(200).send(`Movies are downloaded and converted! ${movies.length}`)
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})
filmsRouter.get('/films/readall',(req, res) => {
    const sortedMoviesByPosition = [...movies].sort((a, b) => a.position - b.position);
    res.status(200).send(sortedMoviesByPosition);
})
filmsRouter.get('/films/read', (req, res) =>{
    const { id } = req.query;
    let filmById = movies.find(item => item.id === Number(id));
    if (filmById) {
        return res.status(200).send(filmById);
    } else {
        return res.status(404).send('Film not found');
    }
})
filmsRouter.post('/films/update', (req, res) => {
    const { id } = req.body;
    let filmById = movies.find(item => item.id === Number(id));
    let filmIndex = movies.findIndex(item => item.id === Number(id));
    if (!filmById) {
        return res.status(404).send('Film not found');
    } else {
        let newBody = req.body;
        for (let key in newBody) {
            filmById[key] = newBody[key];
        }
        movies[filmIndex] = filmById;
        writeFile(fileToPath, movies);
        return res.status(200).send(filmById);
    }
})
filmsRouter.delete('/films/delete', (req, res) => {
    const { id } = req.query;
    if (id > 0 && id < movies.length) {
        movies.splice(id - 1, 1);
        let i = 0;
        movies.map(item => {
             i = i + 1;
             item.id = i;
        });
        writeFile(fileToPath, movies);
        return res.status(200).send('Delete successfully');
    } else {
        return res.status(404).send('Film not found');
    }
})
function validatePostDataObject(body){
    let rez = ''
    let q = [
        "title",
        "rating",
        "year",
        "budget",
        "poster",
        "position",
    ]
    q.forEach(field => {
        if (!body.hasOwnProperty(field)) {
            rez = `Request does not have a ${field} field`
        }
    })
    return rez;
}
filmsRouter.post('/films/create', (req, res) => {
    const { body } = req;
        let validationError = validatePostDataObject(body)
        if (!validationError) {
            const newFilm = {
                id : movies.length + 1,
                title : body.title,
                rating : body.rating,
                year : body.year,
                budget : body.budget,
                poster : body.poster,
                position : body.position
            };
            movies.push(newFilm);
            writeFile(fileToPath, movies);
            return res.status(201).send(`Added new movie`);

        } else {
            return res.status(400).send(validationError)
        }
})

module.exports = {
    filmsRouter
}
