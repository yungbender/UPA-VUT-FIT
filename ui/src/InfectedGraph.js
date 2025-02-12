import React, { useState, useEffect } from 'react';
import {
    ComposedChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, Bar, ResponsiveContainer, BarChart,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Common.css'
import Card from './Card';
import { Row, Col, Spinner, Toast } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';

function InfectedGraph() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [growthFrom, setGrowthFrom] = useState(new Date(Date.now() - 12096e5));
    const [growthTo, setGrowthTo] = useState(new Date());
    const [smaFrom, setSmaFrom] = useState(new Date(Date.now() - 12096e5));
    const [smaTo, setSmaTo] = useState(new Date());
    const [smaStep, setSmaStep] = useState(10);
    const [smaMax, setSmaMax] = useState(14);
    const [smaTag, setSmaTag] = useState("SMA "+smaStep.toString());
    const [refresh, setRefresh] = useState(false);

    const [apiUrl, setApiUrl] = useState("");

    const convertApiData = (data_to_convert) => {
        console.log(data_to_convert);
        let converted_data = [];
        for (let i = 0; i < data_to_convert["abs_growth"].length; i++) {
            let obj = {
                "date" : data_to_convert["abs_growth"][i].date,
                "agrowth" : data_to_convert["abs_growth"][i].value,
                "pgrowth" : data_to_convert["perc_growth"][i].value
            };
            if (i >= (smaStep - 1)) {
                obj["sma"] = data_to_convert["sma"][i-smaStep+1].value;
            }
            converted_data.push(obj);
        }
        return converted_data;
    };

    const refreshGraph = (rawData) => {
        rawData.json().then(
            (data) => {
                console.log(data);
                if (!data.success) {
                    setError("Unsuccessful API fetch");
                    setLoading(false);
                    return;
                }
                setData(convertApiData(data.data))
                setLoading(false)
                setError(null);
                if (refresh)
                {
                    setRefresh(false);
                }
            }
        )
    };

    const handleGrowthFromChange = (date) => {
        setGrowthFrom(date);
        setSmaFrom(date);
    };

    const handleGrowthToChange = (date) => {
        setGrowthTo(date);
        setSmaTo(date);
    };

    const handleSmaStepChange = (step) => {
        setSmaStep(step);
        setSmaTag("SMA "+step.toString());
    }

    const legendFormatter = (value, entry) => {
        const { color } = entry;
        if (value == "Absolute growth")
            return (<span style={{ color }}>Absolute growth</span>);
        else if (value == "Percentual growth")
            return (<span style={{ color }}>Percentual growth</span>);
        else
            return (<span style={{ color }}>{smaTag}</span>);
    }

    const tickHelper = (tick) => {
        return tick + "%";
    };

    useEffect(() => {
        if (!refresh) {
            return;
        };
        const interval = setInterval(() => {
            fetch(apiUrl, {method: "GET"})
                .then((result) => refreshGraph(result));
        }, 5000);
        return () => clearInterval(interval);
    }, [refresh]);

    useEffect(() => {
        fetch(apiUrl, {method: "GET"})
             .then((result) => refreshGraph(result))
             .catch(_ => {
                setError("Cannot fetch API endpoint");
                setLoading(false);
                if (!refresh) {
                    setRefresh(true);
                }
            });
    }, [apiUrl]);

    useEffect(() => {
        setApiUrl(
            "http://" + process.env.REACT_APP_API_URL + "/query/infected" +
            "?growth_from=" + growthFrom.toISOString().substring(0,10) +
            "&growth_to=" + growthTo.toISOString().substring(0,10) +
            "&sma_from=" + smaFrom.toISOString().substring(0,10) +
            "&sma_to=" + smaTo.toISOString().substring(0,10) +
            "&sma_step=" + smaStep
        );
    }, [smaMax, smaStep]);

    useEffect(() => {
        let time_diff = Math.round(((growthTo.getTime() - growthFrom.getTime()) / (1000 * 3600 * 24)));
        if (smaStep > time_diff) {
            setSmaStep(time_diff+1);
            setSmaTag("SMA "+(time_diff+1).toString());
        }
        setSmaMax(time_diff+1);
    }, [growthFrom, growthTo, smaFrom, smaTo]);

    if (loading) {
        return (
            <Card>
                <Spinner animation="border" role="status" variant="light" style={{marginLeft: "50%"}}>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </Card>
        );
    } else if (error != null) {
        return (
            <Card style={{color: "whitesmoke"}}>
                <p style={{color: "red", textAlign: "center"}}>Error: {error}</p>
            </Card>
        );
    }

    return (
        <Card>
            <Row>
                <ResponsiveContainer width="100%" minHeight={500} style={{paddingBottom: "2%"}}>
                    <ComposedChart data={data}
                    margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                        <XAxis angle={-25} textAnchor="end" dataKey="date" tick={{fill: "whitesmoke"}}/>
                        <YAxis tick={{fill: "whitesmoke"}}/>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip contentStyle={{ backgroundColor: "#090909", border: "None", borderRadius: "8px"}}
                         labelStyle={{color: "whitesmoke"}}/>
                        <Legend verticalAlign="top" wrapperStyle={{color: "whitesmoke", paddingBottom: "0.3%", marginTop: "-0.5%"}} 
                        formatter={legendFormatter}/>
                        <Bar name="Absolute growth" dataKey="agrowth" fill="#ec1111"></Bar>
                        <Line name={smaTag} dataKey="sma" stroke="#76f66a" strokeWidth="3"></Line>
                    </ComposedChart>
                </ResponsiveContainer>
            </Row>
            <Row style={{paddingTop: "2%"}}>
                <Col align="center">
                    <label>Date from:</label>
                    <DatePicker  selected={growthFrom} onChange={handleGrowthFromChange} dateFormat="yyyy-MM-dd"
                    todayButton="Today" selectsStart startDate={growthFrom} maxDate={new Date(growthTo.getTime() - 864e5)}
                    endDate={growthTo}/>

                </Col>
                <Col align="center">
                    <label>Date to:</label>
                    <DatePicker  selected={growthTo} onChange={handleGrowthToChange} dateFormat="yyyy-MM-dd"
                    todayButton="Today" selectsEnd startDate={growthFrom} minDate={new Date(growthFrom.getTime() + 864e5)}
                    endDate={growthTo} maxDate={new Date()}/>
                </Col>
                <Col align="center">
                    <label>SMA step:</label>
                    <NumericInput strict={true} min={1} max={smaMax} 
                    value={smaStep} onChange={handleSmaStepChange} 
                    style={{
                        input: {
                            background: '#302b2b',
                            color: 'white',
                        },
                    }}/>
                </Col>
            </Row>
            <Row>
                <ResponsiveContainer width="100%" minHeight={500} style={{paddingBottom: "2%"}}>
                    <BarChart data={data}
                    margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                        <XAxis angle={-25} textAnchor="end" dataKey="date" tick={{fill: "whitesmoke"}}/>
                        <YAxis tickFormatter={tickHelper} tick={{fill: "whitesmoke"}}/>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip contentStyle={{ backgroundColor: "#090909", border: "None", borderRadius: "8px"}}
                         labelStyle={{color: "whitesmoke"}}/>
                        <Legend verticalAlign="top" wrapperStyle={{color: "whitesmoke", paddingBottom: "0.3%", marginTop: "-0.5%"}} 
                        formatter={legendFormatter}/>
                        <Bar name="Percentual growth" dataKey="pgrowth" fill="#ec1111"></Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Row>
        </Card>
    );
}

export default InfectedGraph;
