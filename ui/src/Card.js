import React from 'react';
import { Container } from 'react-bootstrap';

class Card extends React.Component {
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return(<Container fluid="true" className="justify-content-md-center" style={{backgroundColor:"#090909", margin:"3%", padding:"0.75%", borderRadius: "10px"}}>
                {this.props.children}
               </Container>);
    }
}

export default Card;
