import { Add, Block } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    LinearProgress,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { getName, handleError } from '../../helpers/helpers';
import { StyledDialogSubtitle } from '../../styles/overviewDialogStyles';
import { TooltipText } from '../../styles/styles';
import { HeaderTableCell, OverviewContainer, StyledSmallTableContainer, StyledTableCell } from '../../styles/tableStyles';

const ButtonsContainer = styled(Box)`
    display: flex;
    justify-content: center;
`;

const ConfirmButton = styled(Button)`
    margin: 1vh 1vw;
`;

const ClinicianOverview = ({ clinicians, loadClinicians }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currUser, setCurrUser] = useState();

    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const handleOpenDialog = (user) => {
        setCurrUser(user);
        setIsOpen(true);
    };

    const handleCloseDialog = () => {
        setIsOpen(false);
    };

    const handleDisableAccount = () => {
        setIsLoading(true);

        const cleanup = () => {
            setIsLoading(false);
            loadClinicians();
            setIsOpen(false);
        };

        if (currUser?.isActive) {
            // apiClient.delete(`/user/${currUser?.userID}`)
            //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            //     .finally(cleanup);
        } else {
            // apiClient.put('/user', { userID: currUser?.userID, isActive: true })
            //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            //     .finally(cleanup);
        }
    };

    return (
        <>
            <OverviewContainer>
                <StyledSmallTableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <HeaderTableCell>First Name</HeaderTableCell>
                                <HeaderTableCell>Last Name</HeaderTableCell>
                                <HeaderTableCell>Email</HeaderTableCell>
                                <HeaderTableCell>Phone</HeaderTableCell>
                                <HeaderTableCell>Status</HeaderTableCell>
                                <HeaderTableCell>Action</HeaderTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clinicians.map((clinician) => (
                                <TableRow key={clinician.userID}>
                                    <StyledTableCell>{clinician.firstName}</StyledTableCell>
                                    <StyledTableCell>{clinician.lastName}</StyledTableCell>
                                    <StyledTableCell>{clinician.email}</StyledTableCell>
                                    <StyledTableCell>{clinician.phone}</StyledTableCell>
                                    <StyledTableCell>{clinician.isActive ? 'Active' : 'Inactive'}</StyledTableCell>
                                    <StyledTableCell>
                                        <Tooltip
                                            title={
                                                <TooltipText>{clinician.isActive ? 'Deactivate account' : 'Activate account'}</TooltipText>
                                            }
                                        >
                                            <IconButton onClick={() => handleOpenDialog(clinician)}>
                                                {clinician.isActive ? <Block /> : <Add />}
                                            </IconButton>
                                        </Tooltip>
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledSmallTableContainer>
            </OverviewContainer>
            <Dialog open={isOpen} onClose={handleCloseDialog}>
                <DialogContent>
                    <StyledDialogSubtitle>
                        Do you really want to {currUser?.isActive ? 'deactivate' : 'activate'}
                        {` ${getName(currUser)}`}'s account?
                    </StyledDialogSubtitle>
                    {isLoading && <LinearProgress />}
                    <ButtonsContainer>
                        <ConfirmButton variant="outlined" onClick={handleCloseDialog}>
                            no
                        </ConfirmButton>
                        <ConfirmButton
                            variant="contained"
                            color={currUser?.isActive ? 'error' : 'primary'}
                            onClick={handleDisableAccount}
                        >
                            yes
                        </ConfirmButton>
                    </ButtonsContainer>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClinicianOverview;