import React, { useContext, useState } from 'react';
import { LinearProgress } from '@mui/material';
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Scatter,
  ScatterChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AppContext } from '../../context/AppContext';
import { getUnit } from '../../helpers/helpers';
import { darkTheme, lightTheme } from '../../styles/theme';

const Chart = ({ measurement, thresholds, data, defaultChart }) => {
    
    const { isDarkMode } = useContext(AppContext);
    const theme = isDarkMode ? darkTheme : lightTheme;

    // State for selected chart type
    const [chartType, setChartType] = useState(defaultChart);
     
    const noRef = ['Usage', 'Head Tilt'];

    const domains = {
        Usage: [0, 12],
        AHI: [0, 'auto'],
        SpO2: [60, 100],
        Temperature: [30, 50],
        'Head Tilt': [-90, 90],
    };
    const units = {
        Usage: ' hour(s)',
        AHI: ' event(s)/hour',
        SpO2: '%',
        Temperature: '°C',
        'Head Tilt': '°',
    }

    if (!thresholds) return <></>;

    // Function to render chart based on selected type
    const renderChart = () => {
        const xAxisLabel = { value: 'Dates', position: 'insideBottomRight', offset: -5 };
        const yAxisLabel = {
            value: `${measurement}${units[measurement]}`,
            angle: -90,
            position: 'insideLeft',
            dy: 30, 
        };
        const chartMargin = { top: 5, right: 30, left: 20, bottom: 20 };
        switch (chartType) {
            case 'BarChart':
                return (
                    <BarChart data={data} margin={chartMargin}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <ReferenceLine y={thresholds.lowerThreshold} label="Lower" stroke="orange" strokeDasharray="3 3" />
                        <ReferenceLine y={thresholds.upperThreshold} label="Upper" stroke="red" strokeDasharray="3 3" />
                        <XAxis dataKey="time"  label={xAxisLabel}/>
                        <YAxis type="number" domain={domains[measurement]}  label={yAxisLabel}/>
                        <Tooltip />
                        <Bar
                            dataKey="data"
                            name={measurement}
                            fill={theme.palette.primary.main}
                            unit={getUnit(measurement)}
                        />
                    </BarChart>
                );
            case 'ScatterChart':
                return (
                    <ScatterChart data={data} margin={chartMargin}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <ReferenceLine y={thresholds.lowerThreshold} label="Lower" stroke="orange" strokeDasharray="3 3" />
                        <ReferenceLine y={thresholds.upperThreshold} label="Upper" stroke="red" strokeDasharray="3 3" />
                        <XAxis dataKey="time"  label={xAxisLabel}/>
                        <YAxis type="number" domain={domains[measurement]}  label={yAxisLabel}/>
                        <Tooltip />
                        <Scatter
                            dataKey="data"
                            name={measurement}
                            fill={theme.palette.primary.main}
                        />
                    </ScatterChart>
                );
            case 'LineChart':
            default:
                return (
                    <LineChart data={data} margin={chartMargin}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <ReferenceLine y={thresholds.lowerThreshold} label="Lower" stroke="orange" strokeDasharray="3 3" />
                        <ReferenceLine y={thresholds.upperThreshold} label="Upper" stroke="red" strokeDasharray="3 3" />
                        <XAxis dataKey="time"  label={xAxisLabel}/>
                        <YAxis type="number" domain={domains[measurement]}  label={yAxisLabel}/>
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="data"
                            name={measurement}
                            stroke={theme.palette.primary.main}
                            unit={getUnit(measurement)}
                            connectNulls
                        />
                    </LineChart>
                );
        }
    };

    return (
        <>
            <ResponsiveContainer height={250} width="100%">
                {renderChart()}
            </ResponsiveContainer>
        </>
    );
};

export default Chart;
