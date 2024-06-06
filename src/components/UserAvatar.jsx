import { Add, RemoveCircleOutline } from '@mui/icons-material';
import { Avatar, Box, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { capitaliseFirstLetter, getName, handleError, stringAvatar } from '../helpers/helpers';
import { StyledTypography } from '../styles/styles';

const UserContainer = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1vh;
    margin-right: 1vw;
`;

const UserInfo = styled(Box)`
    display: flex;
    align-items: center;
`;

const StyledAvatar = styled(Avatar)`
    margin-right: 1vw;
`;

const UserRole = styled(StyledTypography)`
    font-size: 0.95rem;
`;

const UserAvatar = ({ user, careGroup, loadCareGroup }) => {
    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const checkInCareGroup = () => {
        const clinicianInCareGroup = careGroup.clinicians.find((clinician) => clinician.userID === user.userID);
        const patientInCareGroup = careGroup.patients.find((patient) => patient.userID === user.userID);

        return (clinicianInCareGroup || patientInCareGroup) !== undefined;
    };

    const handleIconClick = () => {
        const body = {
            userID: user.userID,
            careGroupID: careGroup.groupInfo.groupID,
        };

        if (checkInCareGroup()) {
            // apiClient.delete('/caregroup', { data: body })
            //     .then(loadCareGroup)
            //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible));
        } else {
            // apiClient.put('/caregroup', body)
            //     .then(loadCareGroup)
            //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible));
        }
    };

    const name = getName(user);

    return (
        <UserContainer>
            <UserInfo>
                <StyledAvatar {...stringAvatar(name)} />
                <Box>
                    <StyledTypography>{name}</StyledTypography>
                    <UserRole>{capitaliseFirstLetter(user.role)}</UserRole>
                </Box>
            </UserInfo>
            <IconButton onClick={handleIconClick} size="large">
                {checkInCareGroup() ? <RemoveCircleOutline /> : <Add />}
            </IconButton>
        </UserContainer>
    );
};

export default UserAvatar;