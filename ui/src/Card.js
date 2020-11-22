import React from 'react';
import { Row } from 'react-bootstrap';

class Card extends React.Component {
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return(<Row className="justify-content-md-center" style={{backgroundColor:"#090909", margin:"3%", padding:"0.75%"}}>
                {this.props.children}
               </Row>);
    }
}

export default Card;
