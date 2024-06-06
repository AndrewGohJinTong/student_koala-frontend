import { LinearProgress } from '@mui/material';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { handleError } from '../../helpers/helpers';
import { StyledPatientButton } from '../../styles/styles';
import PatientSettingDouble from './PatientSettingDouble';
import PatientSettingSingle from './PatientSettingSingle';


const PatientSettings = ({ settings, setSettings, handleToggleContent }) => {
    const [defaultSettings, setDefaultSettings] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    useEffect(() => {
        setIsLoading(true);

        // apiClient.get('/settings')
        //     .then((res) =>
        //         setDefaultSettings(
        //             res.data.settings.reduce(
        //                 (prev, curr) => ({ ...prev, [curr.settingName]: curr }),
        //                 {}
        //             )
        //         )
        //     )
        //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
        //     .finally(() => setIsLoading(false));
        // eslint-disable-next-line
    }, []);

    const handleUpdateSetting = (e, setting, settingValue) => {
        const settingsCopy = { ...settings };
        const toChange = settingsCopy[setting];

        if (settingValue === 1) toChange.primaryValue = e.target.value;
        if (settingValue === 2) toChange.secondaryValue = e.target.value;

        setSettings(settingsCopy);
    }

    const handleUpdateReason = (e, setting) => {
        const settingsCopy = { ...settings };
        const toChange = settingsCopy[setting];

        toChange.changeReason = e.target.value;

        setSettings(settingsCopy);
    };

    const handleSaveChanges = () => {
        if (!settings) return;

        // apiClient.put('/settings', { settings: Object.values(settings) })
        //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
        //     .finally(() => setIsLoading(false));

        handleToggleContent();
    };

    if (!settings || !defaultSettings) return <></>;

    return (
        <>
            {isLoading && <LinearProgress />}
            <PatientSettingSingle
                settingValues={settings}
                defaultSettingValues={defaultSettings}
                settingInfo={{ name: 'usage', title: 'Usage', comparator: 'Below' }}
                handleUpdateSetting={handleUpdateSetting}
                handleUpdateReason={handleUpdateReason}
            />
            <PatientSettingDouble
                settingValues={settings}
                defaultSettingValues={defaultSettings}
                settingInfo={{
                    name: 'ahi',
                    title: 'AHI',
                }}
                handleUpdateSetting={handleUpdateSetting}
                handleUpdateReason={handleUpdateReason}
            />
            <PatientSettingDouble
                settingValues={settings}
                defaultSettingValues={defaultSettings}
                settingInfo={{
                    name: 'spo2',
                    title: 'SpO2',
                }}
                handleUpdateSetting={handleUpdateSetting}
                handleUpdateReason={handleUpdateReason}
            />
            <PatientSettingDouble
                settingValues={settings}
                defaultSettingValues={defaultSettings}
                settingInfo={{
                    name: 'temp',
                    title: 'Temperature',
                }}
                handleUpdateSetting={handleUpdateSetting}
                handleUpdateReason={handleUpdateReason}
            />
            <PatientSettingSingle
                settingValues={settings}
                defaultSettingValues={defaultSettings}
                settingInfo={{ name: 'tilt', title: 'Head Tilt', comparator: 'Below' }}
                handleUpdateSetting={handleUpdateSetting}
                handleUpdateReason={handleUpdateReason}
            />
            <StyledPatientButton variant="contained" onClick={handleSaveChanges}>
                Save Changes
            </StyledPatientButton>
        </>
    );
};

export default PatientSettings;