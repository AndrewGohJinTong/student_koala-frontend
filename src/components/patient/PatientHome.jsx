import { Edit } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { getName, handleError } from '../../helpers/helpers';
import { Container, StyledPatientButton, StyledTypography } from '../../styles/styles';
import ClinicalNoteForm from '../forms/NoteForm'
import ClinicialAlertForm from '../forms/AlertForm'
import EditPatientAccountForm from '../forms/EditPatientAccountForm';
import PatientSettings from '../patient/PatientSettings'
import PatientData from '../patient/PatientData';
import apiClient from '../../api/apiClient';
import ArchivedNotes from './ArchivedNotes';
import ArchivedAlerts from './ArchivedAlerts';

const PatientDetailsContainer = styled(Box)`
    border: ${({ theme }) => `1px solid ${theme.palette.primary.dark}`};
    padding: 3vh 0;
    border-radius: 5px;
`;

const TopDetailsContent = styled(Box)`
    display: flex;
    justify-content: space-between;
    margin-bottom: 3vh;
    padding: 0 2vw;
`;

const BottomDetailsContent = styled(TopDetailsContent)`
    padding: 0 2vw;
    margin: 0;
`;

const NameContainer = styled(Box)`
    display: flex;
    align-items: center;
`;

const PatientName = styled(StyledTypography)`
    font-size: 1.5rem;
    font-weight: bold;
    padding-right: 0.5vw;
`;

const StyledDialogContent = styled(DialogContent)`
    padding: 2vh 2vw;
`;

const StyledDeviceInfo = styled(Box)`
    height: 10vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 4vh;
`;

const ButtonsContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    margin: 2vh 0;
`;

const StyledButton = styled(Button)`
    width: 5vw;
`;

const PatientHome = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isQrLoading, setIsQrLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isDeviceOpen, setIsDeviceOpen] = useState(false);
    const [isMainContent, setIsMainContent] = useState(false);
    const [dialogContent, setDialogContent] = useState('');
    const [deviceDialogContent, setDeviceDialogContent] = useState('');
    const [patient, setPatient] = useState();
    const [data, setData] = useState([]);
    const [device, setDevice] = useState();
    const [alerts, setAlerts] = useState([]);
    const [notes, setNotes] = useState([]);
    const [qrCode, setQrCode] = useState('');
    const [settings, setSettings] = useState({});
    const [currNoteID, setCurrNoteID] = useState(-1);
    const [currNoteDesc, setCurrNoteDesc] = useState('');

    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const { patientID } = useParams();
    const navigate = useNavigate();

    const loadUser = () => {
        setIsLoading(true);
        apiClient.get(`/user/patient/${patientID}`)
            .then((res) => setPatient(res.data.userData))
            .catch((err) => {
                handleError(err, setErrorMessage, setErrorVisible);
                navigate('/', { replace: true });
            })
            .finally(() => setIsLoading(false));
    };

    const loadData = () => {
        setIsLoading(true);
        apiClient.get(`/data/${patientID}`)
            .then((res) => setData(res.data.result))
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsLoading(false));
    };

    const loadDevice = () => {
        setIsLoading(true);
        apiClient.get(`/device/${patientID}`)
            .then((res) => setDevice(res.data.device))
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsLoading(false));
    };

    const loadAlerts = () => {
        setIsLoading(true);
        apiClient.get(`/alerts/${patientID}`)
            .then((res) => setAlerts(res.data.alerts))
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsLoading(false));
    };

    const loadNotes = () => {
        setIsLoading(true);
        apiClient.get(`/notes/${patientID}`)
            .then((res) => setNotes(res.data.notes))
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsLoading(false));
    };

    const loadSettings = () => {
        setIsLoading(true);
        apiClient.get(`/settings/${patientID}`)
            .then((res) => {
                setSettings(
                    res.data.settings.reduce(
                        (prev, curr) => ({ ...prev, [curr.settingName]: curr }),
                        {}
                    )
                );
            })
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsLoading(false));
    };

    const generateNonce = () => {
        setIsQrLoading(true);
        apiClient.post('/device/nonce')
            .then((res) => {
                const qrData = {
                    endpoint: 'http://localhost:3000/device',
                    method: 'POST',
                    nonce: res.data.nonce,
                };

                setQrCode(JSON.stringify(qrData));
            })
            .finally(() => setIsQrLoading(false));
    };

    useEffect(() => {
        loadUser();
        loadData();
        loadDevice();
        loadAlerts();
        loadNotes();
        loadSettings();
        generateNonce();
        // eslint-disable-next-line
    }, []);

    // Check for new device information after the device popup is closed
    useEffect(() => {
        if (!isDeviceOpen) loadDevice();
        // eslint-disable-next-line
    }, [isDeviceOpen]);

    // Regenerate the nonce every 5 minutes
    useEffect(() => {
        const expiry = 5;
        const interval = setInterval(() => generateNonce(), expiry * 60000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, []);

    const handleDeprovisionDevice = () => {
        apiClient.delete(`/device/${patientID}`)
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsOpen(false));
    };

    const handleMarkAlertResolved = (alertID) => {
        apiClient.put('/alerts', { alertID })
            .then(() => loadAlerts())
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible));
    };

    const handleMarkNotesArchived = (noteID, isResolved) => {
        apiClient.put('/notes', { noteID, isResolved })
            .then(() => loadNotes())
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible));
    };

    const handleToggleContent = () => {
        setIsMainContent(!isMainContent);
        window.scrollTo(0, 0);
    };

    const handleOpenDialog = (content) => {
        setDialogContent(content);
        setIsOpen(true);
    };

    const handleOpenDeviceDialog = (content) => {
        setDeviceDialogContent(content);
        setIsDeviceOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDeviceOpen(false);
        setIsOpen(false);
    };

    const getDialogTitle = () => {
        if (dialogContent === 'editAccount') {
            return 'Account Settings';
        } else if (dialogContent === 'createNote') {
            return 'Add Note';
        } else if (dialogContent === 'editNote') {
            return 'Edit Note';
        } else if (dialogContent === 'device') {
            return 'Device Information';
        } else if (dialogContent === 'createAlert') {
            return 'Create Alert';
        } else {
            return '';
        }
    };

    const getDeviceDialogTitle = () => {
        if (deviceDialogContent === 'provisionDevice') {
            return 'Provision Device';
        } else if (deviceDialogContent === 'deprovisionDevice') {
            return 'Deprovision Device';
        } else {
            return '';
        }
    };

    const getDialogContent = () => {
        if (!patient) return <></>;
        if (dialogContent === 'editAccount') {
            return <EditPatientAccountForm patient={patient} setPopupOpen={setIsOpen} loadData={loadUser} />;
        } else if (dialogContent === 'createNote') {
            return <ClinicalNoteForm patientID={patient.userID} setPopupOpen={setIsOpen} loadData={loadNotes} />;
        } else if (dialogContent === 'createAlert') {
            return <ClinicialAlertForm patientID={patient.userID} setPopupOpen={setIsOpen} loadData={loadAlerts} />;
        } else if (dialogContent === 'editNote') {
            return (
                <ClinicalNoteForm
                    patientID={patient.userID}
                    setPopupOpen={setIsOpen}
                    loadData={loadNotes}
                    noteID={currNoteID}
                    desc={currNoteDesc}
                    isEdit={true}
                />
            );
        } else if (dialogContent === 'device') {
            return device ? (
                <>
                    <StyledDeviceInfo>
                        <StyledTypography>Cradle ID: {device.cradleID}</StyledTypography>
                        <StyledTypography>Mouthguard ID: {device.mouthguardID}</StyledTypography>
                        <StyledTypography>Device PIN: {device.devicePin}</StyledTypography>
                    </StyledDeviceInfo>
                    <StyledPatientButton variant="contained" onClick={() => handleOpenDeviceDialog('deprovisionDevice')}>
                        Deprovision Device
                    </StyledPatientButton>
                </>
            ) : (
                <></>
            );
        } else if (dialogContent === 'archivedNotes'){ 
            return (<ArchivedNotes patientID={patient.userID} />)
        }  else if (dialogContent === 'archivedAlerts'){ 
            return (<ArchivedAlerts patientID={patient.userID} />)
        } 
        else {
            return <></>;
        }
    };

    const getDeviceDialogContent = () => {
        if (deviceDialogContent === 'provisionDevice') {
            return isQrLoading ? <>QR code loading...</> : <QRCode value={qrCode} />;
        } else if (deviceDialogContent === 'deprovisionDevice') {
            return (
                <>
                    <StyledTypography>Do you want to deprovision this device?</StyledTypography>
                    <ButtonsContainer>
                        <StyledButton variant="outlined" onClick={handleCloseDialog}>
                            No
                        </StyledButton>
                        <StyledButton variant="contained" color="error" onClick={handleDeprovisionDevice}>
                            Yes
                        </StyledButton>
                    </ButtonsContainer>
                </>
            );
        } else {
            return <></>;
        }
    };

    const handleEditNote = (noteID, description) => {
        setCurrNoteID(noteID);
        setCurrNoteDesc(description);
        handleOpenDialog('editNote');
    };

    if (isLoading || !patient) {
        return <LinearProgress />;
    }

    return (
        <>
            <Container>
                <PatientDetailsContainer>
                    <TopDetailsContent>
                        <NameContainer>
                            <PatientName>{getName(patient)}</PatientName>
                            <IconButton onClick={() => handleOpenDialog('editAccount')}>
                                <Edit />
                            </IconButton>
                        </NameContainer>
                        <Box>
                            {device ? (
                                <>
                                    <StyledPatientButton variant="contained" onClick={() => handleOpenDialog('device')}>
                                        View Device
                                    </StyledPatientButton>
                                </>
                            ) : (
                                <StyledPatientButton variant="contained" onClick={() => handleOpenDeviceDialog('provisionDevice')}>
                                    Provision Device
                                </StyledPatientButton>
                            )}
                        </Box>
                    </TopDetailsContent>
                    <BottomDetailsContent>
                        <StyledTypography>Patient ID: {patient.userID}</StyledTypography>
                        <StyledTypography>Email: {patient.email}</StyledTypography>
                        <StyledTypography>Phone: {patient.phone}</StyledTypography>
                        <StyledTypography>
                            Latest Data:{' '}
                            {device && device.lastTransmission
                                ? DateTime.fromISO(device.lastTransmission).toLocaleString(DateTime.DATETIME_SHORT)
                                : 'n/a'}
                        </StyledTypography>
                    </BottomDetailsContent>
                </PatientDetailsContainer>
                {!isMainContent ? (
                    <PatientData
                        alerts={alerts}
                        data={data}
                        notes={notes}
                        settings={settings}
                        handleMarkNotesArchived={handleMarkNotesArchived}
                        handleMarkAlertResolved={handleMarkAlertResolved}
                        handleEditNote={handleEditNote}
                        handleOpenDialog={handleOpenDialog}
                        handleToggleContent={handleToggleContent}
                    />
                ) : (
                    <PatientSettings
                        settings={settings}
                        setSettings={setSettings}
                        handleToggleContent={handleToggleContent}
                    />
                )}
            </Container>
            <Dialog open={isOpen} onClose={handleCloseDialog}>
                <DialogTitle>{getDialogTitle()}</DialogTitle>
                <StyledDialogContent>{getDialogContent()}</StyledDialogContent>
            </Dialog>
            <Dialog open={isDeviceOpen} onClose={handleCloseDialog}>
                <DialogTitle>{getDeviceDialogTitle()}</DialogTitle>
                <StyledDialogContent>{getDeviceDialogContent()}</StyledDialogContent>
            </Dialog>
        </>
    );
};

export default PatientHome;