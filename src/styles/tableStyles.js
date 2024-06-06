import { TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const OverviewContainer = styled('div')`
    width: 100%;
`;

export const OverviewTitle = styled(Typography)`
    color: ${({ theme }) => theme.palette.primary.dark};
    font-size: 1.5rem;
    font-weight: bold;
    margin-left: 0.5vw;
`;

export const StyledTableContainer = styled(TableContainer)`
    height: 70vh;
`;

export const StyledSmallTableContainer = styled(TableContainer)`
    height: 60vh;
`;

export const StyledTableRow = styled(TableRow)`
    &:hover {
        cursor: pointer;
    }
`;

export const StyledTableCell = styled(TableCell)`
    text-align: center;
    padding-left: 0;
    padding-right: 0;
    width: 300px;
`;

export const HeaderTableCell = styled(StyledTableCell)`
    font-weight: bold;
    border-bottom: 1px solid;
`;