import { Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { getName, handleError } from '../../helpers/helpers';
import apiClient from '../../api/apiClient';

const StyledOption = styled('div')`
    padding: 1vh 1vw;
    &:hover {
        cursor: pointer;
    }
`;

const SearchBar = () => {
    const [users, setUsers] = useState([]);
    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const navigate = useNavigate();

    useEffect(() => {
        apiClient
            .get('/user')
                .then((res) => setUsers(res.data.filter((user) => user.role === 'patient')))
                .catch((err) => handleError(err, setErrorMessage, setErrorVisible));
        // eslint-disable-next-line
    }, []);

    return (
        <Autocomplete 
            options={users}
            isOptionEqualToValue={(option, value) => option.userID === value.userID}
            getOptionLabel={(option) => getName(option)}
            renderOption={(props, option, { selected }) => (
                <StyledOption onClick={() => navigate(`/patient/${option.userID}`)}>{getName(option)}</StyledOption>
            )}
            renderInput={(params) => <TextField {...params} label="Patient name" />}
        />
    );
};

export default SearchBar;