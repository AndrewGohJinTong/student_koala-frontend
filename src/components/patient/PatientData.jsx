import { styled } from '@mui/system';
import { Accordion, AccordionDetails, Box, LinearProgress, TextField } from '@mui/material';
import { DateTime, Interval } from 'luxon';
import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { twoDP } from '../../helpers/helpers';
import { StyledPatientButton, StyledTypography } from '../../styles/styles';

import Alert from './Alert';
import Chart from './Chart';
import Note from './Note';
import PatientAccordionSummary from './PatientAccordionSummary';
import Summary from './Summary';
import apiClient from '../../api/apiClient';
import { AppContext } from '../../context/AppContext';
import { handleError } from '../../helpers/helpers';

const PatientDataContainer = styled(Box)`
    margin-bottom: 5vh;
`;

const FiltersContainer = styled(Box)`
    display: flex;
    align-items: center;
    margin: 1.5vh 0;
`;

const StyledAccordion = styled(Accordion)`
    margin-bottom: 2vh;
    border: ${({ theme }) => `1px solid ${theme.palette.primary.dark}`};
    border-radius: 5px;
`;

export const ButtonsContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    width: 425px;
    align-self: flex-end;
`;

const PatientData = ({
    alerts,
    data,
    notes,
    settings,
    handleMarkNotesArchived,
    handleMarkAlertResolved,
    handleEditNote,
    handleOpenDialog,
    handleToggleContent
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const [startDate, setStartDate] = useState(DateTime.now().minus({ weeks: 1 }).toISODate());
    const [endDate, setEndDate] = useState(DateTime.now().toISODate());
    const [thresholds, setThresholds] = useState({});

    const dummy_usage_data = [
        {"DataEntry": {"time": "2024-05-20T07:24:59"}, "NumValue": {"value": 9}},
        {"DataEntry": {"time": "2024-05-20T10:46:59"}, "NumValue": {"value": 3}},
        {"DataEntry": {"time": "2024-05-24T14:45:59"}, "NumValue": {"value": 2}},
        {"DataEntry": {"time": "2024-05-26T07:24:59"}, "NumValue": {"value": 8}},
        {"DataEntry": {"time": "2024-05-21T15:36:59"}, "NumValue": {"value": 9}},
        {"DataEntry": {"time": "2024-05-19T08:23:59"}, "NumValue": {"value": 0}},
        {"DataEntry": {"time": "2024-05-14T19:47:59"}, "NumValue": {"value": 11}},
        {"DataEntry": {"time": "2024-05-17T15:44:59"}, "NumValue": {"value": 12}},
        {"DataEntry": {"time": "2024-05-02T15:52:59"}, "NumValue": {"value": 0}},
        {"DataEntry": {"time": "2024-05-01T16:17:59"}, "NumValue": {"value": 3}}
    ];
    const dummy_ahi_data = [
        {"DataEntry": {"time": "2024-05-20T07:24:59"}, "NumValue": {"value": 12}},
        {"DataEntry": {"time": "2024-05-25T10:46:59"}, "NumValue": {"value": 13}},
        {"DataEntry": {"time": "2024-05-24T14:45:59"}, "NumValue": {"value": 14}},
        {"DataEntry": {"time": "2024-05-26T07:24:59"}, "NumValue": {"value": 23}},
        {"DataEntry": {"time": "2024-05-27T15:36:59"}, "NumValue": {"value": 32}},
        {"DataEntry": {"time": "2024-05-23T08:23:59"}, "NumValue": {"value": 22}},
        {"DataEntry": {"time": "2024-05-22T19:47:59"}, "NumValue": {"value": 19}},
        {"DataEntry": {"time": "2024-05-28T15:44:59"}, "NumValue": {"value": 19}},
        {"DataEntry": {"time": "2024-05-20T15:52:59"}, "NumValue": {"value": 21}},
        {"DataEntry": {"time": "2024-05-01T16:17:59"}, "NumValue": {"value": 13}}
    ];

    const dummy_spo2_data = [
        {"DataEntry": {"time": "2024-05-20T07:24:59"}, "NumValue": {"value": 78}},
        {"DataEntry": {"time": "2024-05-25T10:46:59"}, "NumValue": {"value": 83}},
        {"DataEntry": {"time": "2024-05-24T14:45:59"}, "NumValue": {"value": 86}},
        {"DataEntry": {"time": "2024-05-26T07:24:59"}, "NumValue": {"value": 75}},
        {"DataEntry": {"time": "2024-05-10T15:36:59"}, "NumValue": {"value": 92}},
        {"DataEntry": {"time": "2024-05-23T08:23:59"}, "NumValue": {"value": 84}},
        {"DataEntry": {"time": "2024-05-22T19:47:59"}, "NumValue": {"value": 87}},
        {"DataEntry": {"time": "2024-05-28T15:44:59"}, "NumValue": {"value": 93}},
        {"DataEntry": {"time": "2024-05-20T15:52:59"}, "NumValue": {"value": 81}},
        {"DataEntry": {"time": "2024-05-01T16:17:59"}, "NumValue": {"value": 75}}
    ];
    const dummy_temp_data = [
        {"DataEntry": {"time": "2024-05-20T07:24:59"}, "NumValue": {"value": 37}},
        {"DataEntry": {"time": "2024-05-25T10:46:59"}, "NumValue": {"value": 37}},
        {"DataEntry": {"time": "2024-05-24T14:45:59"}, "NumValue": {"value": 40}},
        {"DataEntry": {"time": "2024-05-26T07:24:59"}, "NumValue": {"value": 38}},
        {"DataEntry": {"time": "2024-05-19T15:36:59"}, "NumValue": {"value": 37}},
        {"DataEntry": {"time": "2024-05-23T08:23:59"}, "NumValue": {"value": 36}},
        {"DataEntry": {"time": "2024-05-22T19:47:59"}, "NumValue": {"value": 37}},
        {"DataEntry": {"time": "2024-05-28T15:44:59"}, "NumValue": {"value": 39}},
        {"DataEntry": {"time": "2024-05-20T15:52:59"}, "NumValue": {"value": 38}},
        {"DataEntry": {"time": "2024-05-01T16:17:59"}, "NumValue": {"value": 37}}
    ];
    const dummy_tilt_data = [
        {"DataEntry": {"time": "2024-05-20T07:24:59"}, "NumValue": {"value": -60}},
        {"DataEntry": {"time": "2024-05-25T10:46:59"}, "NumValue": {"value": -40}},
        {"DataEntry": {"time": "2024-05-24T14:45:59"}, "NumValue": {"value": 39}},
        {"DataEntry": {"time": "2024-05-26T07:24:59"}, "NumValue": {"value": 63}},
        {"DataEntry": {"time": "2024-05-27T15:36:59"}, "NumValue": {"value": -31}},
        {"DataEntry": {"time": "2024-05-23T08:23:59"}, "NumValue": {"value": 82}},
        {"DataEntry": {"time": "2024-05-22T19:47:59"}, "NumValue": {"value": -12}},
        {"DataEntry": {"time": "2024-05-28T15:44:59"}, "NumValue": {"value": 12}},
        {"DataEntry": {"time": "2024-05-20T15:52:59"}, "NumValue": {"value": 32}},
        {"DataEntry": {"time": "2024-05-01T16:17:59"}, "NumValue": {"value": 45}}
    ];

    // Get the timestamp which corresponds to the first data point to show on the graph
    const getLowerBound = () => DateTime.fromISO(startDate);
    const getUpperBound = () => DateTime.fromISO(endDate);
    const condenseData = (rawData) => {
        const sortedData = rawData.sort((a, b) => new Date(a.DataEntry.time) - new Date(b.DataEntry.time));
        const data = sortedData.map(entry => ({
            ...entry,
            DataEntry: {
                ...entry.DataEntry,
                time: DateTime.fromISO(entry.DataEntry.time).startOf('day')
            }
        }));

        if (!data.length) return [];

        const lowerBound = getLowerBound();
        const upperBound = getUpperBound();
        const filteredData = data.filter((item) => item.DataEntry.time >= lowerBound && item.DataEntry.time <= upperBound);

        if (!filteredData.length) return []; // Early exit if no data to process

        // Start condensing data
        const condensedData = [];
        let currInterval = [];
        let intervalUpperBound = lowerBound.plus({ days: 1 });

        filteredData.forEach((d, index) => {
            if (d.DataEntry.time < intervalUpperBound) {
                currInterval.push(d);
            } else {
                if (currInterval.length) {
                    condensedData.push(condenseInterval(currInterval));
                    currInterval = [];
                }
                intervalUpperBound = d.DataEntry.time.plus({ days: 1 });
                currInterval.push(d);
            }
            if (index === filteredData.length - 1 && currInterval.length) {
                condensedData.push(condenseInterval(currInterval));
            }
        });
        return condensedData;
    };


    const condenseInterval = (currInterval) => {
        const sum = currInterval.reduce((total, curr) => total + curr.NumValue.value, 0);

        return {
            DataEntry: {
                time: currInterval[0].DataEntry.time
            },
            NumValue: {
                value: twoDP(sum / currInterval.length)
            }
        };
    };

    // If there are days with no data, insert a data point with null value to ensure that
    // the graph renders an empty data point on that day
    const fillGaps = (data) => {
        if (!data.length) return [];

        const newData = [];
        const diff = { days: 1 };

        for (let i = 0; i < data.length - 1; i++) {
            const curr = data[i];
            const next = data[i + 1];

            // Make sure current and next items are defined and their DataEntry.time is valid
            if (!curr || !next || !curr.DataEntry || !next.DataEntry || !curr.DataEntry.time || !next.DataEntry.time) continue;

            newData.push(curr);

            // Convert strings to DateTime if necessary and find gaps
            const currTime = DateTime.fromISO(curr.DataEntry.time);
            const nextTime = DateTime.fromISO(next.DataEntry.time);
            const interval = Interval.fromDateTimes(currTime, currTime.plus(diff));

            // Check if there is no gap; if not, continue to next iteration
            if (interval.contains(nextTime)) continue;

            // Insert blank data for each day in the gap
            for (let dummyTime = currTime.plus(diff); dummyTime < nextTime; dummyTime = dummyTime.plus(diff)) {
                newData.push({
                    DataEntry: { time: dummyTime.toISO() },
                    NumValue: { value: Number.MIN_SAFE_INTEGER }
                });
            }
        }

        // Add the last item if it exists
        if (data.length > 0) {
            const lastItem = data[data.length - 1];
            if (lastItem !== null && lastItem !== undefined) {
                newData.push(lastItem);
            }
        }

        // Map the data to format it appropriately
        return newData.map(item => ({
            data: item.NumValue.value === Number.MIN_SAFE_INTEGER ? null : item.NumValue.value,
            time: DateTime.fromISO(item.DataEntry.time).toLocaleString(DateTime.DATE_SHORT)
        }));
    };

    const handleDateChange = (event) => {
        const { name, value } = event.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else if (name === 'endDate') {
            setEndDate(value);
        }
    };

    const getAlertLevel = (alertName) =>
        alerts.find((alert) => alert.alertName === alertName && alert.alertLevel > 0) !== undefined;

    const usageData = fillGaps(condenseData(dummy_usage_data));
    const ahiData = fillGaps(condenseData(dummy_ahi_data));
    const spo2Data = fillGaps(condenseData(dummy_spo2_data));
    const tempData = fillGaps(condenseData(dummy_temp_data));
    const tiltData = fillGaps(condenseData(dummy_tilt_data));
    const { patientID } = useParams();

    useEffect(() => {
        setIsLoading(true);
        apiClient.get(`/threshold/${patientID}`)
            .then(response => {
                const thresholdDict = response.data.reduce((acc, item) => {
                    if (item.active) {
                        acc[item.measurement] = {
                            lowerThreshold: item.lowerValue,
                            upperThreshold: item.upperValue
                        };
                    } else {
                        acc[item.measurement] = {
                            lowerThreshold: null,
                            upperThreshold: null
                        };
                    }
                    return acc;
                }, {});
                setThresholds(thresholdDict);
            })
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsLoading(false));
    }, [patientID]);

    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <>
            <PatientDataContainer>
                <FiltersContainer>
                    <StyledTypography>View data from:</StyledTypography>
                    <TextField
                        label="Start Date"
                        type="date"
                        name="startDate"
                        value={startDate}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ marginLeft: 2 }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        name="endDate"
                        value={endDate}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ marginLeft: 2 }}
                    />
                </FiltersContainer>
                <StyledAccordion defaultExpanded={true}>
                    <PatientAccordionSummary title="Summary" id="Summary" isNote={true} />
                    <AccordionDetails>
                        <Summary
                            usage={usageData}
                            ahi={ahiData}
                            spo2={spo2Data}
                            temp={tempData}
                            tilt={tiltData}
                        />
                    </AccordionDetails>
                </StyledAccordion>
                <StyledAccordion defaultExpanded={true}>
                    <PatientAccordionSummary title="Usage" id="usage" hasAlert={getAlertLevel('usage')} />
                    <AccordionDetails>
                        <Chart measurement="Usage" thresholds={thresholds['usage']} data={usageData} defaultChart={'BarChart'} />
                    </AccordionDetails>
                </StyledAccordion>
                <StyledAccordion defaultExpanded={true}>
                    <PatientAccordionSummary title="AHI" id="ahi" hasAlert={getAlertLevel('ahi')} />
                    <AccordionDetails>
                        <Chart measurement="AHI" thresholds={thresholds['ahi']} data={ahiData} defaultChart={'LineChart'} />
                    </AccordionDetails>
                </StyledAccordion>
                <StyledAccordion defaultExpanded={true}>
                    <PatientAccordionSummary title="SpO2" id="spo2" hasAlert={getAlertLevel('spo2')} />
                    <AccordionDetails>
                        <Chart measurement="SpO2" thresholds={thresholds['spo2']} data={spo2Data} defaultChart={'LineChart'} />
                    </AccordionDetails>
                </StyledAccordion>
                <StyledAccordion defaultExpanded={true}>
                    <PatientAccordionSummary title="Temperature" id="temperature" hasAlert={getAlertLevel('temp')} />
                    <AccordionDetails>
                        <Chart measurement="Temperature" thresholds={thresholds['temp']} data={tempData} defaultChart={'LineChart'} />
                    </AccordionDetails>
                </StyledAccordion>
                <StyledAccordion defaultExpanded={true}>
                    <PatientAccordionSummary title="Head Tilt" id="tilt" hasAlert={getAlertLevel('tilt')} />
                    <AccordionDetails>
                        <Chart measurement="Head Tilt" thresholds={thresholds['tilt']} data={tiltData} defaultChart={'ScatterChart'} />
                    </AccordionDetails>
                </StyledAccordion>
                <StyledAccordion defaultExpanded={true}>
                    <PatientAccordionSummary title="Clinical Notes" id="notes" isNote={true} />
                    <AccordionDetails>
                        {notes.length > 0
                            ? notes
                            .filter((note) => !note.isResolved)
                            .map((note) => <Note note={note} handleEditNote={handleEditNote} handleMarkNotesArchived={handleMarkNotesArchived} />)
                            : 'No clinical notes found'}
                    </AccordionDetails>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                        <StyledPatientButton variant='contained' onClick={() => handleOpenDialog('archivedNotes')}>Archived Notes</StyledPatientButton>
                    </Box>
                </StyledAccordion>
                <StyledAccordion defaultExpanded={true}>
                    <PatientAccordionSummary title="Alerts" id="alerts" isNote={true} />
                    <AccordionDetails>
                        {alerts.length > 0
                            ? alerts
                                .filter((alert) => !alert.isResolved)
                                .map((alert) => <Alert alert={alert} handleMarkAlertResolved={handleMarkAlertResolved} />)
                                .reverse()
                            : 'No alerts found'}
                    </AccordionDetails>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                        <StyledPatientButton variant='contained' onClick={() => handleOpenDialog('archivedAlerts')}>Archived Alerts</StyledPatientButton>
                    </Box>
                </StyledAccordion>
                <StyledAccordion defaultExpanded={true}>
                    <PatientAccordionSummary title="Device Alerts" id="deviceAlerts" isNote={true} />
                    <AccordionDetails>Device alerts will go in here</AccordionDetails>
                </StyledAccordion>
            </PatientDataContainer>
            <ButtonsContainer>
                <StyledPatientButton variant="contained" onClick={() => handleOpenDialog('createNote')}>
                    Add Note
                </StyledPatientButton>
                <StyledPatientButton variant="contained" onClick={() => handleOpenDialog('createAlert')}>
                    Add Alert
                </StyledPatientButton>
                <StyledPatientButton variant="contained" onClick={handleToggleContent}>
                    Notification Settings
                </StyledPatientButton>
            </ButtonsContainer>
        </>
    );
};

export default PatientData;
