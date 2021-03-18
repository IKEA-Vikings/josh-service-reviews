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

  getReviewSummaries(pageNumber, callback) {
    console.log('now getting review summaries');
    this.mongoose.connect('mongodb://localhost/vikea', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = this.mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      this.Review.aggregate([
        { $group: { _id: '$productId', average: { $avg: '$overall' }, number: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 20 }
      ])
        .then(summaries => {
          console.log('finished getting review summaries');
          console.log(summaries);
          db.close();
          callback(summaries);
        });
    });
  }

  getReviewSummary(productId, callback) {
    console.log('now getting review summary for product ' + productId);
    this.mongoose.connect('mongodb://localhost/vikea', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = this.mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      var agg = [
        { $match: { productId: { $in: productId.map(id => Number(id)) } } },
        { $group: { _id: '$productId', average: { $avg: '$overall' }, number: { $sum: 1 } } }
      ];
      console.log(agg);
      this.Review.aggregate(agg)
        .then(summary => {
          console.log('finished getting summary');
          db.close();
          callback(summary);
        });
    });
  }

  getReviewDetails(productId, callback) {
    console.log('getting review details for product ' + productId);
    this.mongoose.connect('mongodb://localhost/vikea', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = this.mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      var agg = [
        { $match: { productId: Number(productId) } },
        {
          $group: {
            _id: '$productId',
            overall: { $avg: '$overall' },
            number: { $sum: 1 },
            easeOfAssembly: { $avg: '$easeOfAssembly' },
            valueForMoney: { $avg: '$valueForMoney' },
            appearance: { $avg: '$appearance' },
            productQuality: { $avg: '$productQuality' },
            worksAsExpected: { $avg: '$worksAsExpected' }
          }
        }
      ];
      this.Review.aggregate(agg)
        .then(averageRatings => {
          this.Review.find({productId: Number(productId)}).limit(20)
            .then(reviews => {
              db.close();
              callback({
                itemID: Number(productId),
                averageRatings: averageRatings,
                page: null,
                customerReviews: reviews
              });
            });
        });
    });
  }

  getSingleReview(productId, reviewId, callback) {
    console.log('getting single review ' + reviewId + ' from product ' + productId);
    this.mongoose.connect('mongodb://localhost/vikea', { useNewUrlParser: true, useUnifiedTopology: true});
    const db = this.mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      this.Review.find({productId: Number(productId), reviewId: Number(reviewId)})
        .then(review => {
          db.close();
          callback(review);
        });
    });
  }
}

module.exports = Db;
