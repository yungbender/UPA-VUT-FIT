import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Alert, Spinner } from 'react-bootstrap'


class RatioGraph extends React.Component {
    constructor(props)
    {
        super(props);
        this.api_url = "http://" + process.env.REACT_APP_API_URL + "/query/ratio?date_from=2020-04-01";
        this.state = {data: null, 
                      error: null, loading: true};
    }

    refreshGraph(rawData)
    {
        rawData.json().then(
            (data) => {
                console.log(data);
                if (!data.success)
                {
                    this.setState({error: "Unsuccessful API fetch", loading: false})
                    return
                }
                this.setState({data: data.data, loading: false})})
    }

    componentDidMount()
    {
        fetch(this.api_url, {method: "GET"})
            .then((result) => this.refreshGraph(result))
            .catch(_ => this.setState({error: "Cannot fetch API endpoint", loading: false}));
    }

    tickHelper(tick)
    {
        return tick + "%"
    }

    render()
    {
        if(this.state.loading) 
        {
            return (<Spinner animation="border" role="status" variant="light">
                    <span className="sr-only">Loading...</span>
                    </Spinner>);
        }
        else if(this.state.error != null)
        {
            return (<Alert variant="danger">{this.state.error}</Alert>)
        }

        return (
            <ResponsiveContainer width="100%" height={550} style={{paddingBottom: "2%"}}>
                <AreaChart  data={this.state.data}
                margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                <defs>
                    <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec1111" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec1111" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCured" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#76f66a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#76f66a" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="date" angle={-25} textAnchor="end" />
                <YAxis tickFormatter={this.tickHelper}/>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="death_ratio" stroke="#ec1111" fillOpacity={1} fill="url(#colorDeaths)" />
                <Area type="monotone" dataKey="cured_ratio" stroke="#76f66a" fillOpacity={1} fill="url(#colorCured)" />
                </AreaChart>
            </ResponsiveContainer>);
    }
}

export default RatioGraph;
