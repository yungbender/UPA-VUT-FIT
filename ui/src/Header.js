import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

class Header extends React.Component {
    render()
    {
        return (<Navbar style={{backgroundColor: "#000000"}} expand="lg">
                  <Navbar.Brand style={{color: "white"}}>UPA Covid19</Navbar.Brand>
                    <ButtonGroup className="ml-auto mr-1">
                        <Button variant="outline-light">Refresh deaths data</Button>
                        <Button variant="outline-light">Refresh COVID data</Button>
                    </ButtonGroup>
                </Navbar>);
    }
}

export default Header;
