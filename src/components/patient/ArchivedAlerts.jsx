import { styled } from '@mui/system';
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import { handleError } from '../../helpers/helpers';
import { AccordionDetails, LinearProgress } from '@mui/material';
import apiClient from '../../api/apiClient';
import Alert from './Alert';
import { StyledTypography } from '../../styles/styles';

const AccordionTitle = styled(StyledTypography)`
    font-weight: bold;
    margin-left: 1vw;
`;

const ArchivedAlerts = ({ patientID}) => {
    const { currUser, setErrorMessage, setErrorVisible } = useContext(AppContext);


    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);



    const loadAlerts = () => {
        setIsLoading(true);
        apiClient.get(`/alerts/${patientID}`)
            .then((res) => {
                // console.log(res);
                const alerts = res.data.alerts.filter(note => note.isResolved);
                setAlerts(alerts);

            })
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsLoading(false));
    };
    useEffect(()=> {
        loadAlerts();
        // eslint-disable-next-line
    }, []);


    if (isLoading) {
        return <LinearProgress />;
    }


    return (
        <>
            <AccordionTitle>Archived Alerts</AccordionTitle>
            <AccordionDetails>
                {alerts.length > 0
                    ? alerts.map((alert) => <Alert alert={alert}/>)
                    : 'No clinical Alerts found'}
            </AccordionDetails>
        </>
    );
};

export default ArchivedAlerts;