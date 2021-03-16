import React from 'react';
import Stars from './stars.jsx';
import Bar from './bar.jsx';
import Subratings from './subratings.jsx';

const CustomerReview = function ({ data }) {
  return (
    <div className='customer-review'>
      <div className='customer-review-header'>
        <Stars count={data.overall} />
        <div className='name-and-date'>
          {data.name} - {data.date}
        </div>
      </div>
      <h4>{data.title}</h4>
      <p>{data.reviewText}</p>
      <div className='recommendation'>
        {data.recommended ? 'Yes, I recommend this product' : 'No, I do not recommend this product'}
      </div>
      <Subratings
        easeOfAssembly={data.easeOfAssembly}
        valueForMoney={data.valueForMoney}
        productQuality={data.productQuality}
        appearance={data.appearance}
        worksAsExpected={data.worksAsExpected}
      />
    </div>
  );
};

export default CustomerReview;
