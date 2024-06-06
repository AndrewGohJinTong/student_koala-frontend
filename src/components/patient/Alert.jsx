import { Check, Person, PriorityHigh } from '@mui/icons-material';
import { Checkbox, Tooltip } from '@mui/material';
import { Box, styled } from '@mui/system';
import { DateTime, Interval } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { getName, handleError } from '../../helpers/helpers';
import { red, yellow } from '../../styles/alertStyles';
import { SmallerText, StyledContainer, StyledContents, StyledMetadata } from '../../styles/patientStyles';
import { StyledTypography } from '../../styles/styles';

const StyledAlertContainer = styled(StyledContainer, {
    shouldForwardProp: (prop) => prop !== 'alertLevel',
})(({ alertLevel }) => ({
    background: alertLevel ? (alertLevel === 1 ? yellow : red) : 'none',
}));

const StyledAlertTitle = styled(StyledTypography)`
    font-weight: bold;
`;

const StyledAlertMetadata = styled(StyledMetadata)`
    flex-direction: column;
    margin-top: 0.5vh;
`;

const StyledAlertMetadataItem = styled(Box)`
    display: flex;
    align-items: center;
`;

const StyledAlertDescription = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const StyledAlertResolve = styled(Box)`
    display: flex;
    align-items: center;
`;

const Alert = ({ alert, handleMarkAlertResolved }) => {
    const [clinician, setClinician] = useState();

    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const { alertID, clinicianID, alertName, description, alertLevel, isResolved, creationDate, updatedOn } = alert;

    useEffect(() => {
        if (!clinicianID) return;

        // apiClient.get(`/user/staff/${clinicianID}`)
        //     .then((res) => setClinician(res.data.userData))
        //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible));
        // eslint-disable-next-line
    }, []);

    const getAlertName = (alertName) => {
        if (alertName === 'ahi') return 'AHI';
        if (alertName === 'spo2') return 'SpO2';
        if (alertName === 'temp') return 'Temperature';
        if (alertName === 'tilt') return 'Head Tilt';
        if (alertName === 'usage') return 'Usage';
    };

    const alertCreationDate = DateTime.fromISO(creationDate);
    const alertResolvedDate = DateTime.fromISO(updatedOn);
    const timeToResolve = Interval.fromDateTimes(alertCreationDate, alertResolvedDate);

    const getTimeToResolve = () => {
        const hoursToResolve = timeToResolve.length('hours');
        const minsToResolve = timeToResolve.length('minutes');
        const secondsToResolve = timeToResolve.length('seconds');

        if (hoursToResolve > 1) return `${Math.floor(hoursToResolve)} hours`;
        if (minsToResolve > 1) return `${Math.floor(minsToResolve)} minutes`;
        return `${Math.floor(secondsToResolve)} seconds`;
    };

    return (
        <StyledAlertContainer alertLevel={alertLevel}>
            <StyledAlertTitle>{getAlertName(alertName)}</StyledAlertTitle>
            <StyledAlertMetadata>
                <StyledAlertMetadataItem>
                    <Tooltip title="Created on">
                        <PriorityHigh sx={{ marginRight: '0.25vw', color: 'red' }} />
                    </Tooltip>
                    <SmallerText>{alertCreationDate.toLocaleString(DateTime.DATETIME_SHORT)}</SmallerText>
                </StyledAlertMetadataItem>
                {clinician && (
                    <>
                        <StyledAlertMetadataItem>
                            <Tooltip title="Resolved on">
                                <Check sx={{ marginRight: '0.25vw', color: 'green' }} />
                            </Tooltip>
                            <SmallerText>
                                <>{alertResolvedDate.toLocaleString(DateTime.DATETIME_SHORT)}</>
                                <> ({getTimeToResolve()})</>
                            </SmallerText>
                        </StyledAlertMetadataItem>
                        <StyledAlertMetadataItem>
                            <Tooltip title="Resolved by">
                                <Person sx={{ marginRight: '0.25vw' }} />
                            </Tooltip>
                            <SmallerText>{getName(clinician)}</SmallerText>
                        </StyledAlertMetadataItem>
                    </>
                )}
            </StyledAlertMetadata>
            <StyledAlertDescription>
                <StyledContents>{description}</StyledContents>
                {handleMarkAlertResolved && <StyledAlertResolve>
                    Mark as resolved
                    <Checkbox checked={isResolved} disabled={isResolved} onChange={() => handleMarkAlertResolved(alertID)} />
                </StyledAlertResolve>}
            </StyledAlertDescription>
        </StyledAlertContainer>
    );
};

export default Alert;