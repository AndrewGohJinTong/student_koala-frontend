import React from 'react';
import { TableHead, TableRow, TableSortLabel } from '@mui/material';
import { HeaderTableCell } from '../../styles/tableStyles';

// https://mui.com/material-ui/react-table/#sorting-amp-selecting

const EnhancedTableHead = ({ onRequestSort, order, orderBy }) => {

    const tableHeaders = [
        { id: 'firstName', label: 'First Name' },
        { id: 'lastName', label: 'Last Name' },
        { id: 'ahi', label: 'AHI' },
        { id: 'spo2', label: 'SpO2' },
        { id: 'temp', label: 'Temp' },
        { id: 'tilt', label: 'Head Tilt' },
        { id: 'usage', label: 'Usage' },
        { id: 'lastTransmission', label: 'Last Transmission' },
        { id: 'careGroups', label: 'Care Groups' },
        { id: 'lastReviewed', label: 'Last Reviewed' },
    ];

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {tableHeaders.map((header) => (
                    <HeaderTableCell key={header.id} sortDirection={orderBy === header.id ? order : false}>
                        <TableSortLabel
                            active={orderBy === header.id}
                            direction={orderBy === header.id ? order : 'asc'}
                            onClick={createSortHandler(header.id)}
                        >
                            {header.label}
                        </TableSortLabel>
                    </HeaderTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

export default EnhancedTableHead;