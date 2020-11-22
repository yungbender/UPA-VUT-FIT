import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import Header from './Header';
import RatioGraph from './RatioGraph';
import { Row } from 'react-bootstrap';
import Card from './Card';
import Footer from './Footer';


class App extends React.Component {
  render()
  {
    return (
    <div name="main">
      <Header/>
      <RatioGraph/>
      <Footer/>
    </div>);
  }
}

export default App;
