import { Box, styled } from '@mui/system';
import { StyledTypography } from './styles';

export const StyledContainer = styled(Box)`
    border: ${({ theme }) => `1px solid ${theme.palette.primary.dark}`};
    border-radius: 5px;
    padding: 2vh 2vw;
    margin-bottom: 2vh;

    &:last-child {
        margin-bottom: 0.5vh;
    }
`;

export const StyledMetadata = styled(Box)`
    display: flex;
    margin-bottom: 1vh;
`;

export const StyledContents = styled(StyledTypography)`
    white-space: pre-wrap;
`;

export const SmallerText = styled(StyledTypography)`
    font-size: 0.95rem;
`;
