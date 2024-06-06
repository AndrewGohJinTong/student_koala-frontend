import { Box, LinearProgress, Table, TableBody } from '@mui/material';
import { styled } from '@mui/system';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { twoDP } from '../../helpers/helpers';
import { red, white, yellow } from '../../styles/alertStyles';
import {
    OverviewContainer,
    OverviewTitle,
    StyledTableCell,
    StyledTableContainer,
    StyledTableRow,
} from '../../styles/tableStyles';
import EnhancedTableHead from './EnhancedTableHead';
import SearchBar from './SearchBar';
import { getComparator } from '../../helpers/sortTableCols';

const InfoContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    margin-bottom: 1vh;
`;

const PatientOverviewRow = styled(StyledTableRow, {
    shouldForwardProp: (prop) => prop !== 'background',
})(({ background }) => ({
    background: background,
}));

const PatientOverview = ({ isLoading, patients, loadPatients }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('lastName');

    const navigate = useNavigate();

    useEffect(() => {
        loadPatients();
        // eslint-disable-next-line
    }, []);

    const getBackground = (patient) => {
        if (patient.alertLevel === 2) return red;
        if (patient.alertLevel === 1) return yellow;
        return white;
    };

    const getCellValue = (value) => {
        if (value === null) return 'n/a';
        if (typeof value === 'number') return twoDP(value);

        const DATE_REGEX = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
        return value.match(DATE_REGEX) ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT) : value;
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const renderRows = () =>
        patients
            .slice()
            .sort(getComparator(order, orderBy))
            .map((row, index) => (
                <PatientOverviewRow
                    background={getBackground(row)}
                    key={index}
                    onClick={() => navigate(`/patient/${row.userID}`)}
                >
                    {Object.entries(row).map(([key, value], idx) =>
                        key === 'userID' || key === 'alertLevel' ? (
                            <></>
                        ) : (
                            <StyledTableCell key={`${row.userID}${idx}`}>{getCellValue(value)}</StyledTableCell>
                        )
                    )}
                </PatientOverviewRow>
            ));

    return (
        <OverviewContainer>
            <InfoContainer>
                <OverviewTitle>Patient Overview</OverviewTitle>
                <SearchBar />
            </InfoContainer>
            <StyledTableContainer>
                <Table stickyHeader>
                    <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>{isLoading ? <LinearProgress /> : renderRows()}</TableBody>
                </Table>
            </StyledTableContainer>
        </OverviewContainer>
    );
};

export default PatientOverview;