import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import Header from './Header';
import RatioGraph from './RatioGraph';
import { Row } from 'react-bootstrap';
import Card from './Card';


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
