import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Spinner from 'react-bootstrap/Spinner'


class ButtonFetch extends React.Component {
    constructor(props)
    {
        super(props);

        this.text = props.text;
        this.url = "http://" + props.url;
        this.error_msg = null;
        this.state = {fetch: false, error: false, text: props.text, fetched: false};

        this.sendFetchRequest = this.sendFetchRequest.bind(this);
        this.mouseOverText = this.mouseOverText.bind(this);
        this.mouseLeaveText = this.mouseLeaveText.bind(this);
    }

    sendFetchRequest()
    {
        this.setState({fetch: true});

        fetch(this.url, {method: "GET"})
          .then((res) => {if (res.status != 200)
                          {
                              this.setState({fetch: false, error: true, fetched: false, text: res.statusText});
                              this.error_msg = res.statusText;
                          } 
                          else {this.setState({fetch: false, error: false, fetched: true, text: "In queue"}); this.error_msg = null;}})
          .catch((_) => {this.error_msg = "API unavaiable"; this.setState({fetch: false, error: true, fetched: false})});
    }

    mouseOverText()
    {
        if(this.state.error)
            this.setState({text: this.error_msg});
        else if(this.state.fetched && !this.state.error)
            this.setState({text: "Again?"});
    }

    mouseLeaveText()
    {
        if(this.state.error)
            this.setState({text: "Error"});
        else
            this.setState({text: this.text});
    }

    render()
    {
        if (this.state.fetch)
            return (<Button variant="outline-light"><Spinner animation="border" variant="light"></Spinner></Button>);
        else if (this.state.error)
            return (<Button variant="danger" onClick={this.sendFetchRequest}>{this.state.text}</Button>);
        else if (this.state.fetched)
            return (<Button variant="success" onClick={this.sendFetchRequest} onMouseEnter={this.mouseOverText} onMouseLeave={this.mouseLeaveText}>{this.state.text}</Button>);
        else
            return (<Button variant="outline-light" onClick={this.sendFetchRequest}>{this.state.text}</Button>);
    }
}

class Header extends React.Component {
    render()
    {
        return (<Navbar style={{backgroundColor: "#000000"}} expand="lg">
                  <Navbar.Brand style={{color: "white"}}>UPA Covid19</Navbar.Brand>
                    <ButtonGroup className="ml-auto mr-1">
                        <ButtonFetch text="Refresh covid19 data" url={process.env.REACT_APP_IMPORTER_URL + "/covid19/fetch"} />
                        <ButtonFetch text="Refresh deaths data" url={process.env.REACT_APP_IMPORTER_URL + "/deaths/fetch"} />
                    </ButtonGroup>
                </Navbar>);
    }
}

export default Header;
