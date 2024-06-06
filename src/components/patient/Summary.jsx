import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { DateTime } from 'luxon';
import React from 'react';
import { getUnit, twoDP } from '../../helpers/helpers';
import { StyledTypography } from '../../styles/styles';

const mostRecent = (data) => (data.length > 0 ? data.at(-1)?.data : 'n/a');

const mean = (data) => {
    const filteredData = data.filter((d) => d.data !== null);

    return filteredData.length > 0
        ? twoDP(filteredData.reduce((total, curr) => total + curr.data, 0) / filteredData.length)
        : 'n/a';
};

const median = (data) => {
    if (!data.length) return 'n/a';

    const filteredData = data.filter((d) => d.data !== null);
    const sorted = [...filteredData].sort((a, b) => a.data - b.data);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0 ? twoDP((sorted[mid - 1].data + sorted[mid].data) / 2) : twoDP(sorted[mid].data);
};

const StyledSummaryItemContainer = styled(Box)`
    margin: 2vh 0;
`;

const StyledSummaryTitle = styled(StyledTypography)`
    font-weight: bold;
`;

const StyledDataContainer = styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 50%;
    gap: 1vw;
`;

const StyledDataItem = styled(StyledTypography)`
    width: 30%;
`;

const StyledDataValue = styled('span')`
    font-weight: bold;
`;

const SummaryItem = ({ measurement, data }) => {
    const recent = mostRecent(data);
    const avg = mean(data);
    const med = median(data);

    return (
        <StyledSummaryItemContainer>
            <StyledSummaryTitle>{measurement}</StyledSummaryTitle>
            <StyledDataContainer>
                <StyledDataItem>
                    Most recent: <StyledDataValue>{recent}</StyledDataValue>
                    {recent !== 'n/a' && getUnit(measurement)}
                </StyledDataItem>
                <StyledDataItem>
                    Average: <StyledDataValue>{avg}</StyledDataValue>
                    {avg !== 'n/a' && getUnit(measurement)}
                </StyledDataItem>
                <StyledDataItem>
                    Median: <StyledDataValue>{med}</StyledDataValue>
                    {med !== 'n/a' && getUnit(measurement)}
                </StyledDataItem>
            </StyledDataContainer>
        </StyledSummaryItemContainer>
    );
};

const StyledSummaryContainer = styled(Box)`
    margin-left: 1vw;
`;

const StyledDateRange = styled(StyledTypography)`
    font-weight: bold;
`;

const Summary = ({
    //  currRange,
     usage, ahi, spo2, temp, tilt }) => {
    // const startOfInterval = DateTime.now().minus({ [currRange]: 1 });

    return (
        <StyledSummaryContainer>
            {/* <StyledDateRange>
                {startOfInterval.toLocaleString(DateTime.DATE_SHORT)} - {DateTime.now().toLocaleString(DateTime.DATE_SHORT)}
            </StyledDateRange> */}
            <SummaryItem measurement="Usage" data={usage} />
            <SummaryItem measurement="AHI" data={ahi} />
            <SummaryItem measurement="SpO2" data={spo2} />
            <SummaryItem measurement="Temperature" data={temp} />
            <SummaryItem measurement="Head Tilt" data={tilt} />
        </StyledSummaryContainer>
    );
};

export default Summary;