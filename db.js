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
    // in mongo we could get these summaries by doing for example
    // db.reviews.aggregate([{ $group: { _id: '$productId', average: { $avg: '$overall' }, number: { $sum: 1} }}, { $sort: { _id: 1}}, { $limit: 20 }]);
    console.log('now getting review summaries');
    this.mongoose.connect('mongodb://localhost/vikea', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = this.mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      /*
      const summaries = db.collection('reviews').aggregate([
        { $group: { _id: '$productId', average: { $avg: '$overall' }, number: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);*/

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


      //console.log(summaries);
    });
  }

  getReviewSummary(productId, callback) {
    console.log('now getting review summary for product ' + productId);
    this.mongoose.connect('mongodb://localhost/vikea', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = this.mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      var agg = [
        { $match: { productId: Number(productId) } },
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
}

module.exports = Db;
