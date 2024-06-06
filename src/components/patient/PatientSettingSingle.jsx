import { Box } from '@mui/material';
import React from 'react';
import {
    DefaultSetting,
    NumberField,
    ReasonContainer,
    SettingContainer,
    SettingSubtitle,
    SettingTitle,
    SettingValue,
} from '../../styles/patientSettingStyles';
import { StyledTypography } from '../../styles/styles';
import ReasonTextField from './ReasonTextField';

const PatientSettingSingle = ({
    settingValues,
    defaultSettingValues,
    settingInfo,
    handleUpdateSetting,
    handleUpdateReason
}) => {
    const { name, title, comparator } = settingInfo;

    return (
        <SettingContainer>
            <Box>
                <SettingTitle>{title}</SettingTitle>
                <SettingValue>
                    <SettingSubtitle>Notify if:</SettingSubtitle>
                    <StyledTypography>{comparator}</StyledTypography>
                    <NumberField
                        type="number"
                        onChange={(e) => handleUpdateSetting(e, name, 1)}
                        value={settingValues[name]?.primaryValue}
                    />
                    <StyledTypography>{settingValues[name]?.unit}</StyledTypography>
                    <DefaultSetting>
                        (Default: {comparator} {defaultSettingValues[name].primaryValue} {settingValues[name]?.unit})
                    </DefaultSetting>
                </SettingValue>
            </Box>
            <ReasonContainer>
                <ReasonTextField onChange={(e) => handleUpdateReason(e, name)} />
            </ReasonContainer>
        </SettingContainer>
    );
};

export default PatientSettingSingle;