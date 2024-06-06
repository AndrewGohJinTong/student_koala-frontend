import { Close, Search } from '@mui/icons-material';
import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    LinearProgress,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { getName, handleError } from '../../helpers/helpers';
import { ContentContainer, StyledDialogSubtitle, StyledDialogTitle } from '../../styles/overviewDialogStyles';
import { StyledTypography } from '../../styles/styles';
import {
    HeaderTableCell,
    OverviewContainer,
    StyledSmallTableContainer,
    StyledTableCell,
    StyledTableRow
} from '../../styles/tableStyles';
import UserAvatar from '../UserAvatar';
import apiClient from '../../api/apiClient';

const SearchContainer = styled(Box)`
    margin: 2vh 0;
`;

const SearchBar = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2vh;
`;

const StyledTextField = styled(TextField)`
    width: 100%;
`;

const StyledIconButton = styled(IconButton)`
    margin: 0 1vw;
    color: #ffffff;
    background-color: ${({ theme }) => theme.palette.primary.main};

    &:hover {
        background-color: ${({ theme }) => theme.palette.secondary.main};
    }
`;

const CareGroupOverview = ({ users, careGroups, loadCareGroups }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currGroupID, setCurrGroupID] = useState(-1);
    const [currGroup, setCurrGroup] = useState();
    const [query, setQuery] = useState('');

    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const loadCareGroup = () => {
        if (currGroupID === -1) return;

        setIsLoading(true);

        apiClient.get(`/caregroup/${currGroupID}`)
            .then((res) => setCurrGroup(res.data))
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsLoading(false));
    };

    // eslint-disable-next-line
    useEffect(loadCareGroup, [currGroupID]);

    const handleOpenDialog = (group) => {
        setCurrGroupID(group.groupInfo.groupID);
        setIsOpen(true);
    };

    const handleCloseDialog = () => {
        loadCareGroups();
        setIsOpen(false);
        setQuery('');
    };

    const filterUsers = (users) => {
        return users.filter((user) => getName(user).toLowerCase().startsWith(query.toLowerCase()));
    };

    const renderAvatars = (users, isSearch) => {
        if (!currGroup || !users) return <></>;

        if (!users.length) {
            if (isSearch) {
                return <StyledTypography>There are no users matching the current search term</StyledTypography>;
            } else {
                return <StyledTypography>There are no users of this category in this care group</StyledTypography>;
            }
        }

        return users.map((user) => (
            <UserAvatar key={user.userID} user={user} careGroup={currGroup} loadCareGroup={loadCareGroup} />
        ));
    };

    return (
        <>
            <OverviewContainer>
                <StyledSmallTableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <HeaderTableCell>Name</HeaderTableCell>
                                <HeaderTableCell>Clinicians</HeaderTableCell>
                                <HeaderTableCell>Patients</HeaderTableCell>
                                <HeaderTableCell>Clinician Permissions</HeaderTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {careGroups.map((careGroup) => (
                                <StyledTableRow key={careGroup.groupInfo.groupID} onClick={() => handleOpenDialog(careGroup)}>
                                    <StyledTableCell>{careGroup.groupInfo.groupName}</StyledTableCell>
                                    <StyledTableCell>{careGroup.count.clinicians}</StyledTableCell>
                                    <StyledTableCell>{careGroup.count.patients}</StyledTableCell>
                                    <StyledTableCell>Read/Write</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledSmallTableContainer>
            </OverviewContainer>
            <Dialog open={isOpen} onClose={handleCloseDialog}>
                <StyledDialogTitle>
                    <>{currGroup?.groupInfo.groupName}</>
                    <IconButton onClick={handleCloseDialog}>
                        <Close />
                    </IconButton>
                </StyledDialogTitle>
                <DialogContent>
                    {isLoading && <LinearProgress />}
                    <ContentContainer>
                        <StyledDialogSubtitle>Clinicians in this Group</StyledDialogSubtitle>
                        {currGroup && renderAvatars(currGroup.clinicians)}
                    </ContentContainer>
                    <ContentContainer>
                        <StyledDialogSubtitle>Patients in this Group</StyledDialogSubtitle>
                        {currGroup && renderAvatars(currGroup.patients)}
                    </ContentContainer>
                    <ContentContainer>
                        <StyledDialogSubtitle>Manage Users</StyledDialogSubtitle>
                        <SearchContainer>
                            <SearchBar>
                                <StyledTextField label="Name" onInput={(e) => setQuery((e.target).value)} />
                                <StyledIconButton aria-label="search">
                                    <Search />
                                </StyledIconButton>
                            </SearchBar>
                            {query ? (
                                renderAvatars(filterUsers(users), true)
                            ) : (
                                <StyledTypography>Search for a user...</StyledTypography>
                            )}
                        </SearchContainer>
                    </ContentContainer>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CareGroupOverview