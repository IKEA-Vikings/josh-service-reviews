const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review_id: Number,
  product_id: Number,
  overall: Number,
  ease_of_assembly: Number,
  value_for_money: Number,
  product_quality: Number,
  appearance: Number,
  works_as_expected: Number,
  recommended: Boolean,
  title: String,
  review_text: String,
  reviewer_name: String,
  reviewer_id: Number,
  date: Date
});

const Review = mongoose.model('Review', reviewSchema);

const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const shuffleDeck = function(deck) {
  deck = deck.slice(); // don't want to mutate the input deck.
  for (let i = 0; i < deck.length; i++) {
    let j = i + Math.floor(Math.random() * (deck.length - i));
    swap(deck, i, j);
  }

  return deck;
};

var pickRandom = function (list) {
  return list[Math.floor(Math.random() * list.length)];
}

var productAdjective = function (useAdverb = true) {
  var adjectives = ['lousy', 'great', 'fun', 'stellar', 'terrible', 'ugly', 'beautiful', 'unappealing', 'sturdy', 'clean', 'lovely', 'stunning',
    'good', 'dreamy', 'weird', 'cool', 'decent', 'kitschy', 'fabulous', 'small', 'large', 'cheap', 'fancy', 'fragile', 'icky', 'gross', 'lame'];
  var adverbs = ['pretty', 'really', 'super', 'incredibly', 'utterly', 'somewhat', 'kinda', 'amazingly', 'very', 'kind of', 'absolutely'];

  var adverbRoll = Math.random();
  if (useAdverb && adverbRoll > 0.7) {
    return `${pickRandom(adverbs)} ${productAdjective(adverbRoll > 0.97)}`;
  } else {
    return pickRandom(adjectives);
  }
}

var productNoun = function (useDescription = true) {
  var nouns = ['product', 'item', 'thing', 'gift', 'object', 'doohickey', 'gizmo', 'product', 'item', 'product', 'item', 'product', 'item', 'product', 'item',
    'piece', 'thing'];
  var fors = ['kitchen', 'bathroom', 'bedroom', 'yard', 'husband', 'wife', 'son', 'daughter', 'girlfriend', 'boyfriend', 'sister', 'brother', 'aunt', 'uncle', 'dog', 'cat', 'pet',
    'house', 'apartment', 'condo', 'living room', 'den', 'basement', 'attic', 'job', 'office', 'home office', 'home', 'floor', 'wall', 'coworker', 'fiance', 'dad', 'mom', 'grandma', 'grandpa'];
  var forRoll = Math.random();
  if (useDescription && forRoll > 0.6) {
    return `${productNoun(false)} for my ${pickRandom(fors)}`;
  } else {
    return pickRandom(nouns);
  }
}

var opinion = function (title) {
  var iVerbs = ['think', 'found out', 'would say', 'have to tell you'];
  var itVerbs = ['seems like', 'turns out to be', 'really is', 'was', 'has to be'];
  return `I ${pickRandom(iVerbs)} that it ${pickRandom(itVerbs)} a${'aeiou'.includes(title[0]) ? 'n' : ''} ${title}`;
}

var randomLetter = function() {
  var letters = 'aaaaaaaarrrrrrrrsssssssstttttttteeeeeeennnnnndddddiiiiillllloooooggggkkkmmmhhffvvååjycxz';
  var letters = letters.split('');
  return pickRandom(letters);
}

var randomName = function() {
  var letterCount = Math.random() * 9 + 5;
  var name = '';
  for (var i = 0; i < letterCount; i++) {
    name += randomLetter();
  }

  return name;
}

var randomDate = function() {
  var date = new Date();
  date.setDate(date.getDate() - Math.random() * 10000);
  return date;
}

var generateReview = function (product_id, review_id, reviewer) {
  var title = `${productAdjective()} ${productNoun()}`;
  return {
    review_id,
    product_id,
    overall: Math.ceil(Math.random() * 50) / 10,
    ease_of_assembly: Math.ceil(Math.random() * 50) / 10,
    value_for_money: Math.ceil(Math.random() * 50) / 10,
    product_quality: Math.ceil(Math.random() * 50) / 10,
    appearance: Math.ceil(Math.random() * 50) / 10,
    works_as_expected: Math.ceil(Math.random() * 50) / 10,
    recommended: true,
    title,
    review_text: opinion(title),
    ...reviewer,
    date: randomDate()
  };
}

var generateReviewers = function() {
  var reviewers = [];

  for (var i = 1; i <= 100; i++) {
    reviewers.push({
      reviewer_id: i,
      reviewer_name: randomName()
    });
  }

  return reviewers;
}

var generateReviews = function () {
  var review_id = 1;
  var reviews = [];
  var reviewers = generateReviewers();
  for (var product_id = 1; product_id <= 100; product_id++) {
    var random_threshold = Math.random() ** 2;
    var random_try = Math.random();
    var shuffledReviewers = shuffleDeck(reviewers);
    var reviewer = 0;
    while (random_try > random_threshold && reviewer < shuffledReviewers.length) {
      reviews.push(generateReview(product_id, review_id, reviewer));
      review_id++;
      reviewer++;
      random_try = Math.random();
    }
  }

  return reviews;
}

var saveReview = function (review, cb) {
  mongoose.connect('mongodb://localhost/hotseat', { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function () {
    new Review(review).save(function (err, prompt) {
      db.close();
      if (err) {
        return console.error(err);
      }

      cb();
    });
  })
};

module.exports = { saveReview };
