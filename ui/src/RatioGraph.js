import React, { useState, useEffect } from 'react';
import {
    XAxis, YAxis, Area,
    CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, AreaChart,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Common.css'
import { Row, Col, Spinner, Toast } from 'react-bootstrap'
import Card from './Card';

function RatioGraph() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [dateFrom, setDateFrom] = useState(new Date(Date.now() - 12096e5));
    const [dateTo, setDateTo] = useState(new Date());
    const [refresh, setRefresh] = useState(false);

    const [apiUrl, setApiUrl] = useState("");

    const refreshGraph = (rawData) => {
        rawData.json().then(
            (data) => {
                console.log(data);
                if (!data.success) {
                    setError("Unsuccessful API fetch");
                    setLoading(false);
                    return;
                }
                setData(data.data);
                setLoading(false);
                setError(null);
                if (refresh)
                {
                    setRefresh(false);
                }
            }
        )
    };

    const tickHelper = (tick) => {
        return tick + "%";
    };

    const legendFormatter = (value, entry) => {
        const { color } = entry;
        if (value == "death_ratio")
            return (<span style={{ color }}>Death ratio</span>);
        else
            return (<span style={{ color }}>Cured ratio</span>);
    };

    const handleDateFromChange = (date) => {
        setDateFrom(date);
    };

    const handleDateToChange = (date) => {
        setDateTo(date);
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
            "http://" + process.env.REACT_APP_API_URL + "/query/ratio" +
            "?date_from=" + dateFrom.toISOString().substring(0,10) +
            "&date_to=" + dateTo.toISOString().substring(0,10)
        );
    }, [dateFrom, dateTo]);

    if(loading) {
        return (
            <Card>
                <Spinner animation="border" role="status" variant="light" style={{marginLeft: "50%"}}>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </Card>
        );
    } else if(error != null) {
        return (
            <Card style={{color: "whitesmoke"}}>
                <p style={{color: "red", textAlign: "center"}}>Error: {error}</p>
            </Card>);
    }

    return (
        <Card style={{color: "whitesmoke"}}>
            <Row>
                <ResponsiveContainer width="100%" minHeight={500} style={{paddingBottom: "2%"}}>
                    <AreaChart  data={data}
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
                    <YAxis tickFormatter={tickHelper} tick={{fill: "whitesmoke"}}/>
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip contentStyle={{ backgroundColor: "#090909", border: "None", borderRadius: "8px"}} labelStyle={{color: "whitesmoke"}}/>
                    <Area type="monotone" dataKey="death_ratio" stroke="#ec1111" fillOpacity={1} fill="url(#colorDeaths)" />
                    <Area type="monotone" dataKey="cured_ratio" stroke="#76f66a" fillOpacity={1} fill="url(#colorCured)" />
                    <Legend verticalAlign="top" wrapperStyle={{color: "whitesmoke", paddingBottom: "0.3%", marginTop: "-0.5%"}} formatter={legendFormatter}/>
                    </AreaChart>
                </ResponsiveContainer>
            </Row>
            <Row style={{paddingTop: "2%"}}>
            <Col align="center">
                    <label>Date from:</label>
                    <DatePicker  selected={dateFrom} onChange={handleDateFromChange} dateFormat="yyyy-MM-dd"
                    todayButton="Today" selectsStart startDate={dateFrom} maxDate={new Date(dateTo.getTime() - 864e5)}
                    endDate={dateTo}/>
                </Col>
                <Col align="center">
                    <label>Date to:</label>
                    <DatePicker selected={dateTo} onChange={handleDateToChange} dateFormat="yyyy-MM-dd"
                    todayButton="Today" selectsEnd startDate={dateFrom} minDate={new Date(dateFrom.getTime() + 864e5)}
                    endDate={dateTo} maxDate={new Date()}/>
                </Col>
            </Row>
        </Card>
    );
}

export default RatioGraph;
