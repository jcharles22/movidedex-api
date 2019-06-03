require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movieData = require('./movie-data.json');
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.get('/movie', (req, res) => {
    let data = movieData; 
    const {genre, country, avg_vote} = req.query;

    if(genre) {
        data = data.filter(item => {
            if(item.genre.toLowerCase().includes(genre.toLowerCase())){
                console.log('reached');
                return item
            };
        })
    }

    if(country) {
        data = data.filter(item => {
            if(item['country'].toLowerCase().includes(country.toLowerCase())){
                console.log('reached');
                return item
            };
        })
    }

    if(avg_vote) {
        data = data.filter(item => {
            if(Number(item['avg_vote']) >=Number(avg_vote)) {
                return item
            }
        })
    }
    
    res.send(data);
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server started on port: ${8000}`);
});