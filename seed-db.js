const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewId: Number,
  productId: Number,
  overall: Number,
  easeOfAssembly: Number,
  valueForMoney: Number,
  productQuality: Number,
  appearance: Number,
  worksAsExpected: Number,
  recommended: Boolean,
  title: String,
  reviewText: String,
  reviewerName: String,
  reviewerId: Number,
  date: Date
});

const Review = mongoose.model('Review', reviewSchema);

var swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

var shuffleDeck = function (deck) {
  deck = deck.slice(); // don't want to mutate the input deck.
  for (let i = 0; i < deck.length; i++) {
    let j = i + Math.floor(Math.random() * (deck.length - i));
    swap(deck, i, j);
  }

  return deck;
};

var pickRandom = function (list) {
  return list[Math.floor(Math.random() * list.length)];
};

var productAdjective = function (useAdverb = true) {
  var adjectives = ['lousy', 'great', 'fun', 'stellar', 'terrible', 'ugly', 'beautiful', 'unappealing', 'sturdy', 'clean', 'lovely', 'stunning',
    'good', 'dreamy', 'weird', 'cool', 'decent', 'kitschy', 'fabulous', 'small', 'large', 'cheap', 'fancy', 'fragile', 'icky', 'gross', 'lame'];
  var adverbs = ['pretty', 'really', 'super', 'incredibly', 'utterly', 'somewhat', 'kinda', 'amazingly', 'very', 'kind of', 'absolutely'];

  var adverbRoll = Math.random();
  if (useAdverb && adverbRoll > 0.8) {
    return `${pickRandom(adverbs)} ${productAdjective(adverbRoll > 0.955)}`;
  } else {
    return pickRandom(adjectives);
  }
};

var productNoun = function (useDescription = true) {
  var nouns = ['product', 'item', 'thing', 'gift', 'object', 'doohickey', 'gizmo', 'product', 'item', 'product', 'item', 'product', 'item', 'product', 'item',
    'piece', 'thing'];
  var fors = ['kitchen', 'bathroom', 'bedroom', 'yard', 'husband', 'wife', 'son', 'daughter', 'girlfriend', 'boyfriend', 'sister', 'brother', 'aunt', 'uncle', 'dog', 'cat', 'pet',
    'house', 'apartment', 'condo', 'living room', 'den', 'basement', 'attic', 'job', 'office', 'home office', 'home', 'floor', 'wall', 'coworker', 'fiance', 'dad', 'mom', 'grandma', 'grandpa'];
  var forRoll = Math.random();
  if (useDescription && forRoll > 0.7) {
    return `${productNoun(false)} for my ${pickRandom(fors)}`;
  } else {
    return pickRandom(nouns);
  }
};

var opinion = function (title) {
  var iVerbs = ['think', 'found out', 'would say', 'have to tell you'];
  var itVerbs = ['seems like', 'turns out to be', 'really is', 'was', 'has to be'];
  return `I ${pickRandom(iVerbs)} that it ${pickRandom(itVerbs)} a${'aeiou'.includes(title[0]) ? 'n' : ''} ${title}`;
};

var randomLetter = function () {
  var letters = 'aaaaaaaarrrrrrrrsssssssstttttttteeeeeeennnnnndddddiiiiillllloooooggggkkkmmmhhffvvååjycxz';
  var letters = letters.split('');
  return pickRandom(letters);
};

var randomName = function () {
  var letterCount = Math.random() * 9 + 5;
  var name = '';
  for (var i = 0; i < letterCount; i++) {
    name += randomLetter();
  }

  return name;
};

var randomDate = function () {
  var date = new Date();
  date.setDate(date.getDate() - Math.random() * 10000);
  return date;
};

var generateReview = function (productId, reviewId, reviewer) {
  var title = `${productAdjective()} ${productNoun()}`;
  return {
    reviewId,
    productId,
    overall: Math.ceil(Math.random() * 50) / 10,
    easeOfAssembly: Math.ceil(Math.random() * 50) / 10,
    valueForMoney: Math.ceil(Math.random() * 50) / 10,
    productQuality: Math.ceil(Math.random() * 50) / 10,
    appearance: Math.ceil(Math.random() * 50) / 10,
    worksAsExpected: Math.ceil(Math.random() * 50) / 10,
    recommended: true,
    title,
    reviewText: opinion(title),
    reviewerName: reviewer.name,
    reviewerId: reviewer.id,
    date: randomDate()
  };
};

var generateReviewers = function () {
  var reviewers = [];

  for (var i = 1; i <= 100; i++) {
    reviewers.push({
      id: i,
      name: randomName()
    });
  }

  return reviewers;
};

var generateReviews = function () {
  var reviewId = 1;
  var reviews = [];
  var reviewers = generateReviewers();
  for (var productId = 1; productId <= 100; productId++) {
    var randomThreshold = Math.pow(Math.random(), 2);
    var randomTry = Math.random();
    var shuffledReviewers = shuffleDeck(reviewers);
    var reviewer = 0;
    while (randomTry > randomThreshold && reviewer < shuffledReviewers.length) {
      reviews.push(generateReview(productId, reviewId, shuffledReviewers[reviewer]));
      reviewId++;
      reviewer++;
      randomTry = Math.random();
    }
  }

  return reviews;
};

var seedDatabase = function (callback = () => { }) {
  var reviews = generateReviews();

  console.log('about to try to save all reviews');
  mongoose.connect('mongodb://localhost/vikea', { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    Review.insertMany(reviews)
      .then(() => {
        console.log('finished inserting reviews');
        db.close();
        callback();
      });
  });
};

module.exports = { seedDatabase };
