import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledTabBox = styled(Box)`
    padding: 24px 0;
`;

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
            {value === index && (
                <StyledTabBox>
                    <Typography>{children}</Typography>
                </StyledTabBox>
            )}
        </div>
    );
};

export default TabPanel;