import { Box, DialogTitle, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const StyledDialogTitle = styled(DialogTitle)`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-weight: bold;
    font-size: 1.5rem;
    overflow-wrap: anywhere;
`;

export const StyledDialogSubtitle = styled(Typography)`
    font-weight: 600;
    margin-bottom: 1vh;
`;

export const ContentContainer = styled(Box)`
    margin-bottom: 2vh;
`;
