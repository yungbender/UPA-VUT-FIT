import React from 'react';
import Header from './Header';
import RatioGraph from './RatioGraph';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
  render()
  {
    return (
    <div name="main">
      <Header/>
      <RatioGraph/>
    </div>);
  }
}

export default App;
