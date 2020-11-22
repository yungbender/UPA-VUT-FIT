import React from 'react';
import { Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

class Footer extends React.Component {
    render()
    {
        return (<footer style={{position: "fixed", left: 0, bottom: 0, width: "100%", textAlign: "center", backgroundColor: "#090909", color: "whitesmoke"}}>
                    <p style={{marginTop: 4, marginBottom: 2}}>Pepega team 2020©</p>
                    <p style={{marginTop: 4}}>Authors: Jakub Frejlach (xfrejl00), Tomáš Sasák (xsasak01), Tomáš Venkrbec (xvenkr01)</p>
                </footer>);
    }
}

export default Footer;
