import React from 'react';
import ReactDOM from 'react-dom';
import Review from './review.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {/*<Review />*/}
        hello everybody
        <Review />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
