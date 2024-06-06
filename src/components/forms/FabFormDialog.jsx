import { Dialog, DialogContent, DialogTitle, Fab } from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import CreateCareGroupForm from './CreateCareGroupForm';
import RegisterUserForm from './RegisterUserForm';

const StyledDialogContent = styled(DialogContent)`
    padding: 2vh 2vw;
`;

const FabContainer = styled('div')`
    margin: 0;
    right: 25px;
    bottom: 25px;
    position: fixed;
`;

const StyledFab = styled(Fab)`
    background-color: ${({ theme }) => theme.palette.primary.main};
    color: #ffffff;
    padding: 3vh 1vw;
    border-radius: 10px;

    &:hover {
        background-color: ${({ theme }) => theme.palette.secondary.main};
    }
`;

const FabFormDialog = ({ fabText, formName, loadData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenMainDialog = () => {
        setIsOpen(true);
    };

    const handleCloseMainDialog = () => {
        setIsOpen(false);
    };

    const getDialogContents = (formName) => {
        if (formName === 'clinician') {
        return <RegisterUserForm role="clinician" setPopupOpen={setIsOpen} loadData={loadData} />;
        } else if (formName === 'patient') {
        return <RegisterUserForm role="patient" setPopupOpen={setIsOpen} loadData={loadData} />;
        } else {
        return <CreateCareGroupForm setPopupOpen={setIsOpen} loadData={loadData} />;
        }
    };

    return (
        <>
            <Dialog open={isOpen} onClose={handleCloseMainDialog}>
                <DialogTitle>{fabText}</DialogTitle>
                <StyledDialogContent>{getDialogContents(formName)}</StyledDialogContent>
            </Dialog>
            <FabContainer>
                <StyledFab variant='extended' onClick={handleOpenMainDialog}>
                    {fabText}
                </StyledFab>
            </FabContainer>
        </>
    );
};

export default FabFormDialog;