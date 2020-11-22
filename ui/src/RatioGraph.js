import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Alert, Row, Spinner } from 'react-bootstrap'
import Card from './Card';


class RatioGraph extends React.Component {
    constructor(props)
    {
        super(props);
        this.api_url = "http://" + process.env.REACT_APP_API_URL + "/query/ratio?date_from=2020-04-01";
        this.state = {data: null, 
                      error: null, loading: true};

        this.refreshGraph = this.refreshGraph.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.tickHelper = this.tickHelper.bind(this);
        this.legendFormatter = this.legendFormatter.bind(this);
        this.render = this.render.bind(this);
        this.interval = null;
    }

    refreshGraph(rawData)
    {
        rawData.json().then(
            (data) => {
                if (!data.success)
                {
                    this.setState({error: "Unsuccessful API fetch", loading: false})
                    return
                }
                this.setState({data: data.data, loading: false, error: null});
                if (this.interval != null)
                {
                    clearInterval(this.interval);
                    this.interval = null;
                }
            })
    }

    componentDidMount()
    {
        fetch(this.api_url, {method: "GET"})
            .then((result) => this.refreshGraph(result))
            .catch(_ => {this.setState({error: "Cannot fetch API endpoint", loading: false}); 
                         if (this.interval == null)
                            this.interval = setInterval(this.componentDidMount, 5000);});
    }

    tickHelper(tick)
    {
        return tick + "%"
    }

    legendFormatter(value, entry)
    {
        const { color } = entry;
        if (value == "death_ratio")
            return (<span style={{ color }}>Death Ratio</span>);
        else
            return (<span style={{ color }}>Cured Ratio</span>);
    }

    render()
    {
        if(this.state.loading) 
        {
            return (<Card>
                        <Spinner animation="border" role="status" variant="light" style={{marginLeft: "50%"}}>
                        <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Card>);
        }

        else if(this.state.error != null)
        {
            return (<Card style={{color: "whitesmoke"}}>
                            <p style={{color: "red", textAlign: "center"}}>Error: {this.state.error}</p>
                    </Card>);
        }

        return (
            <Card style={{color: "whitesmoke"}}>
                <Row>
                    <ResponsiveContainer width="100%" minHeight={500} style={{paddingBottom: "2%"}}>
                        <AreaChart  data={this.state.data}
                        margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                        <defs>
                            <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ec1111" stopOpacity={1}/>
                            <stop offset="100%" stopColor="#ec1111" stopOpacity={0.13}/>
                            </linearGradient>
                            <linearGradient id="colorCured" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#76f66a" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#76f66a" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" angle={-25} textAnchor="end" tick={{fill: "whitesmoke"}}/>
                        <YAxis tickFormatter={this.tickHelper} tick={{fill: "whitesmoke"}}/>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip contentStyle={{ backgroundColor: "#090909", border: "None", borderRadius: "8px"}} labelStyle={{color: "whitesmoke"}}/>
                        <Area type="monotone" dataKey="death_ratio" stroke="#ec1111" fillOpacity={1} fill="url(#colorDeaths)" />
                        <Area type="monotone" dataKey="cured_ratio" stroke="#76f66a" fillOpacity={1} fill="url(#colorCured)" />
                        <Legend verticalAlign="top" wrapperStyle={{color: "whitesmoke", paddingBottom: "0.3%", marginTop: "-0.5%"}} formatter={this.legendFormatter}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </Row>
            </Card>);
    }
}

export default RatioGraph;
