import { Box, LinearProgress, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import CareGroupOverview from '../components/admin/CareGroupOverview';
import ClinicianOverview from '../components/admin/ClinicianOverview';
import TabPanel from '../components/admin/TabPanel';
import FabFormDialog from '../components/forms/FabFormDialog';
import { AppContext } from '../context/AppContext';
import { handleError } from '../helpers/helpers';
import { Container, StyledTypography } from '../styles/styles';
import apiClient from '../api/apiClient';

const TabContainer = styled(Box)`
    border-bottom: 1px solid #e0e0e0;
`;

const Heading = styled(StyledTypography)`
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 1vh;
`;

const Subheading = styled(StyledTypography)`
    font-weight: medium;
    font-size: 1.25rem;
    margin-bottom: 1vh;
`;

const StyledTab = styled(Tab)`
    font-weight: bold;
    font-size: 1rem;
`;

const Admin = () => {
    const [currTab, setCurrTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [careGroups, setCareGroups] = useState([]);

    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const a11yProps = (index) => ({
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    });

    const loadCareGroups = () => {
        setIsLoading(true);
        apiClient.get('/caregroup')
            .then((res) => setCareGroups(res.data))
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const loadUsers = () => {
        setIsLoading(true);
        apiClient.get('/user')
            .then((res) => setUsers(res.data))
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadCareGroups();
        loadUsers();
        // eslint-disable-next-line
    }, []);

    const handleChange = (event, newValue) => {
        setCurrTab(newValue);
    };

    return (
        <Container>
            <Heading>Administrator Dashboard</Heading>
            <TabContainer>
                <Tabs value={currTab} onChange={handleChange} aria-label="Administrator Dashboard Tabs">
                    <StyledTab label="Clinicians" {...a11yProps(0)} />
                    <StyledTab label="Care Groups" {...a11yProps(1)} />
                </Tabs>
            </TabContainer>
            <TabPanel value={currTab} index={0}>
                <Subheading>All Clinicians</Subheading>
                {isLoading && <LinearProgress />}
                <ClinicianOverview
                    clinicians={users.filter((user) => user.role === 'clinician')}
                    loadClinicians={loadUsers}
                />
                <FabFormDialog fabText="Add New Clinician" formName="clinician" loadData={loadUsers} />
            </TabPanel>
            <TabPanel value={currTab} index={1}>
                <Subheading>All Care Groups</Subheading>
                {isLoading && <LinearProgress />}
                <CareGroupOverview users={users} careGroups={careGroups} loadCareGroups={loadCareGroups} />
                <FabFormDialog fabText="Create Care Group" formName="caregroup" loadData={loadCareGroups} />
            </TabPanel>
        </Container>
    );
};

export default Admin;