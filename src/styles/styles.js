import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    margin: 10vh 3vw 3vh;
`;

export const CenteredContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10vh 3vw;
`;

export const StyledTypography = styled(Typography)`
    color: ${({ theme }) => theme.palette.primary.dark};
`;

export const TooltipText = styled(Typography)`
    font-size: 0.8rem;
`;

export const StyledPatientButton = styled(Button)`
    width: 200px;
    border-radius: 10px;
    padding-top: 1vh;
    padding-bottom: 1vh;
    margin-left: 1vw; 
    margin-right: 1vw; 

    &:hover {
        background-color: ${({ theme }) => theme.palette.secondary.main};
    }
`;
