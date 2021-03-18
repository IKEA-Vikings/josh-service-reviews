const express = require('express');
const Db = require('../db');
const db = new Db();

const app = express();

app.use(express.static(__dirname + '/../public'));

app.get('/api/reviews', (req, res, next) => {
  db.getReviewSummaries(1, summaries => {
    console.log('got summaries');
    res.send(summaries.map(({_id, average, number}) => ({itemID: _id, average, number})));
  });
});

app.listen(3001, () => console.log('listening'));
