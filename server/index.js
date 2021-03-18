const express = require('express');
const Db = require('../db');
const db = new Db();

const app = express();

app.use(express.static(__dirname + '/../public'));

app.get('/api/reviews', (req, res, next) => {
  db.getReviewSummaries(1, summaries => {
    console.log('got summaries');
    res.send(summaries.map(({ _id, average, number }) => ({ itemID: _id, average, number })));
  });
});

app.get('/api/reviews/:itemID', (req, res, next) => {
  console.log('about to get summary');
  console.log(req.params.itemID);
  db.getReviewSummary(req.params.itemID.split(','), summary => {
    res.send(summary);
  });
});

app.get('/api/reviews/:itemID/details', (req,res,next) => {
  console.log('about to get details');
  db.getReviewDetails(req.params.itemID, details => {
    res.send(details);
  });
});

app.listen(3001, () => console.log('listening'));
