const defaultMongoose = require('mongoose');

class Db {
  constructor(mongoose = defaultMongoose) {
    this.mongoose = mongoose;
    const reviewSchema = new this.mongoose.Schema({
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

    this.Review = this.mongoose.model('Review', reviewSchema);
  }

  addReviews(reviews, callback) {
    console.log(`now adding ${reviews.length} reviews`);
    this.mongoose.connect('mongodb://localhost/vikea', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = this.mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      this.Review.insertMany(reviews)
        .then(() => {
          console.log('finished inserting reviews');
          db.close();
          callback();
        });
    });
  }
}

module.exports = Db;
