import React from 'react';
import Stars from './stars.jsx';
import Bar from './bar.jsx';
import CustomerReview from './customer-review.jsx';
import Subratings from './subratings.jsx';

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'displayModal': false,
      'itemID': 1,
      'averageRatings': {
        'number': 479,
        'overall': 4.4,
        'easeOfAssembly': 5,
        'valueForMoney': 4,
        'productQuality': 3,
        'appearance': 2,
        'worksAsExpected': 1
      },
      'page': {
        'number': 1,
        'outOf': 24
      },
      'customerReviews': [
        {
          'reviewID': 1,
          'name': 'Carlos',
          'date': '02/22/2021',
          'title': 'Good set',
          'reviewText': 'Good set',
          'recommended': true,
          'overall': 5,
          'easeOfAssembly': 3,
          'valueForMoney': 5,
          'productQuality': 5,
          'appearance': 5,
          'worksAsExpected': 5
        },
        {
          'reviewID': 2,
          'name': 'JANELEN',
          'date': '02/19/2021',
          'title': 'Perfect for a guest bedroom',
          'reviewText': 'Clean lines, drawers open easily and they look good.',
          'recommended': true,
          'overall': 5,
          'easeOfAssembly': 4,
          'valueForMoney': 5,
          'productQuality': 5,
          'appearance': 5,
          'worksAsExpected': 5
        }
      ]
    };
  }

  componentDidMount() {
    // console.log(this.state);
  }


  render() {
    return (
      <div className='review'>
        review
        <Stars count={this.state.averageRatings.overall} />
        <div className='modal-wrapper'>
          <div className='review-modal'>
            <h2>Reviews</h2>
            <h3 className='overall'>{this.state.averageRatings.overall}</h3>
            <Stars count={this.state.averageRatings.overall} />
            <div className='average-customer-ratings'>
              <h4>Average customer ratings</h4>
              <div className='ratings'>
                <div className='overall'>
                  <div className='category'>Overall</div>
                  <div className='graphic'><Stars count={this.state.averageRatings.overall} /></div>
                  <div className='rating'>{this.state.averageRatings.overall}</div>
                  <Subratings
                    easeOfAssembly={this.state.averageRatings.easeOfAssembly}
                    valueForMoney={this.state.averageRatings.valueForMoney}
                    productQuality={this.state.averageRatings.productQuality}
                    appearance={this.state.averageRatings.appearance}
                    worksAsExpected={this.state.averageRatings.worksAsExpected}
                  />
                </div>
              </div>
            </div>
            {this.state.customerReviews.map((review, key) => {
              return (
                <CustomerReview data={review} key={key} />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

window.Review = Review;
export default Review;
