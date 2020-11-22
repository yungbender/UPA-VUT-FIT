import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import Header from './Header';
import RatioGraph from './RatioGraph';
import InfectedGraph from './InfectedGraph';
import Footer from './Footer';


class App extends React.Component {
  render()
  {
    return (
    <div name="main">
      <Header/>
      <RatioGraph/>
      <InfectedGraph/>
      <Footer/>
    </div>);
  }
}

export default App;
