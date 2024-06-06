import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { StyledTextField } from './formStyles';
import { StyledTypography } from './styles';

export const SettingContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    border: ${({ theme }) => `1px solid ${theme.palette.primary.dark}`};
    border-radius: 5px;
    padding: 3vh 2vw;
    margin: 2vh 0;
`;

export const SettingTitle = styled(StyledTypography)`
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 1vh;
`;

export const SettingValue = styled(Box)`
    display: flex;
    align-items: center;
    margin-bottom: 2vh;
`;

export const SettingSubtitle = styled(StyledTypography)`
    width: 5vw;
    margin-right: 3vw;
`;

export const DefaultSetting = styled(StyledTypography)`
    margin-left: 1vw;
`;

export const NumberField = styled(StyledTextField)`
    width: 6vw;
    margin: 0 1vw;
`;

export const ReasonContainer = styled(Box)`
    width: 40%;
`;
