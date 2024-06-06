import React, { useState, useEffect, useContext } from 'react';
import { LinearProgress, Box, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import apiClient from "../../api/apiClient";
import { handleError } from "../../helpers/helpers";
import { StyledContainer, StyledMetadata, SmallerText, StyledContents } from "../../styles/patientStyles";
import { StyledTypography } from '../../styles/styles';
import { AppContext } from '../../context/AppContext';

const StyledName = styled(StyledTypography)`
    font-weight: bold;
`;

const StyledAlertTitle = styled(StyledTypography)`
    font-weight: bold;
    color: red;  // Alert title always in red
`;

const AlertsList = styled(Box)`
    height: 240px;
    width: 300px;
    overflow-y: auto; 
`;


const AlertsSummary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const { setErrorMessage, setErrorVisible } = useContext(AppContext);
    const navigate = useNavigate();

    const loadAlerts = () => {
        setIsLoading(true);
        apiClient.get('/clinicianAlerts')
            .then((res) => {
                const unresolvedAlerts = res.data.filter(alert => !alert.isResolved);
                setAlerts(unresolvedAlerts); 
            })
            .catch((err) => {
                handleError(err, setErrorMessage, setErrorVisible);
                navigate('/', {replace: true});
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadAlerts();
    }, []);

    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <StyledContainer>
            <StyledName style={{fontSize: "20px"}}>Alerts</StyledName>
            <AlertsList>
                {alerts.map((alert) => (
                    <StyledContainer key={alert.alertID} onClick={() => navigate(`/patient/${alert.patient.userID}`)} style={{ cursor: 'pointer' }}>                        
                        <Box style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <StyledName>
                                {`${alert.patient.userData.firstName} ${alert.patient.userData.lastName}`}
                            </StyledName>
                            <SmallerText style={{ marginLeft: '8px' }}> 
                               {DateTime.fromISO(alert.creationDate).toLocaleString(DateTime.DATE_SHORT)}
                                {alert.creationDate !== alert.updatedOn && (
                                    <>, last edited: {DateTime.fromISO(alert.updatedOn).toLocaleString(DateTime.DATE_SHORT)}</>
                                )}
                            </SmallerText>
                        </Box>
                        <StyledMetadata>
                            <Box style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                <StyledAlertTitle>
                                    {`${alert.alertName} (Level ${alert.alertLevel})`}
                                </StyledAlertTitle>
                            </Box>
                        </StyledMetadata>
                        <Box>
                            <StyledContents>{alert.description}</StyledContents>
                        </Box>
                    </StyledContainer>
                ))}
            </AlertsList>
        </StyledContainer>
    );
};

export default AlertsSummary;
