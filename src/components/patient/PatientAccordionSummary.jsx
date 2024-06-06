import { Check, ErrorOutline, ExpandMore, Notes } from '@mui/icons-material';
import { AccordionSummary, Box } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { StyledTypography } from '../../styles/styles';

const AccordionSummaryContents = styled(Box)`
    display: flex;
`;

const AccordionTitle = styled(StyledTypography)`
    font-weight: bold;
    margin-left: 1vw;
`;

const PatientAccordionSummary = ({ title, id, hasAlert, isNote }) => {
    return (
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls={id} id={id}>
            <AccordionSummaryContents>
                {isNote ? <Notes /> : hasAlert ? <ErrorOutline sx={{ color: 'red' }} /> : <Check color="success" />}
                <AccordionTitle>{title}</AccordionTitle>
            </AccordionSummaryContents>
        </AccordionSummary>
    );
};

export default PatientAccordionSummary;