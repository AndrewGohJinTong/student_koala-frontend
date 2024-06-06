import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import PatientHome from '../components/patient/PatientHome';
import Thresholds from '../components/patient/Thresholds';

const SidebarContainer = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 200px; 
  height: 100vh;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  margin-top: 64px;
  padding: 10px;
`;

const SidebarButton = styled(Button)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: flex-start;
  width: 100%; 
  margin-bottom: 5px;
`;
const Patient = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <>
            <SidebarContainer>
                <SidebarButton
                    variant={activeTab === 'overview' ? 'contained' : 'text'}
                    onClick={() => setActiveTab('overview')}
                >
                    Patient Overview
                </SidebarButton>
                <SidebarButton
                    variant={activeTab === 'thresholds' ? 'contained' : 'text'}
                    onClick={() => setActiveTab('thresholds')}
                >
                    Thresholds
                </SidebarButton>
            </SidebarContainer>
            <Box marginLeft="200px"> {/* Adjust layout as necessary */}
                {activeTab === 'overview' ? (
                    <PatientHome />
                ) : (
                    <Thresholds />
                )}
            </Box>
        </>
    );
};

export default Patient;
