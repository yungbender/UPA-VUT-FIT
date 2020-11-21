import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class RatioGraph extends React.Component {
    constructor(props)
    {
        super(props);
        this.api_url = "http://" + process.env.REACT_APP_API_URL + "/query/ratio?date_from=2020-11-01";
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
            .then((result) => this.refreshGraph(result));
    }

    render()
    {
        if (this.state.loading) 
        {
            return (<p>loading</p>);
        }

        return (
            <LineChart width={600} height={300} data={this.state.data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <XAxis dataKey="date"/>
           <Tooltip/>
           <Legend />
            <Line dataKey="deaths" color="r"></Line>
            <Line dataKey="cured" color="g"></Line>
          </LineChart>
        );
    }
}

export default RatioGraph;
