import React, { useContext, useState } from 'react';
import { DarkMode, LightMode, Person, Security } from '@mui/icons-material';
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { TooltipText } from '../styles/styles';
import { config } from '../configuration/config';

const Navbar = styled(AppBar)`
    background-color: ${({ theme }) => theme.palette.primary.main};
`;

const StyledToolbar = styled(Toolbar)`
    justify-content: space-between;
`;

const NavbarTitle = styled(Typography)`
    color: #ffffff;
    font-weight: bold;
    font-size: 1.5rem;
    margin-left: 2vw;

    &:hover {
        cursor: pointer;
    }
`;

const ButtonsContainer = styled(Box)`
    display: flex;
    margin-right: 1vw;
`;

const StyledIconButton = styled(IconButton)`
    margin-left: 0.75vw;
`;

const ProfileItem = styled(MenuItem)`
    padding: 1vh 2vw;
    margin: 0.5vh 0;
`;

const Header = () => {
    const { instance } = useMsal();
    // anchorEl is the element the profile dropdown is anchored to, namely the profile icon
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const { setToken, currUser, isDarkMode, setIsDarkMode, setErrorMessage, setErrorVisible } = useContext(AppContext);

    const navigate = useNavigate();

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickTitle = () => {
        navigate('/');
    }

    const handleChangeTheme = () => {
        setIsDarkMode(isDarkMode);
    };

    const handleClickAdmin = () => {
        navigate('/admin');
    };

    const handleClickProfile = () => {
        navigate('/profile');
    };

    const handleClickLogout = () => {
        setToken('');
        instance.logoutRedirect();
    };
    // TODO: FIX UP HARDCODING OF CURRUSER

    return (
        <Navbar position="fixed">
            <StyledToolbar>
                <NavbarTitle onClick={handleClickTitle}>{config.name}</NavbarTitle>
                <ButtonsContainer>
                    <Tooltip title={<TooltipText>Toggle theme</TooltipText>}>
                        <StyledIconButton color='inherit' onClick={handleChangeTheme}>
                            {isDarkMode ? <DarkMode /> : <LightMode />}
                        </StyledIconButton>
                    </Tooltip>
                    {/* <Tooltip title={<TooltipText>Admin Dashboard</TooltipText>}>
                        <StyledIconButton color='inherit' onClick={handleClickAdmin}>
                            <Security />
                        </StyledIconButton>
                    </Tooltip> */}
                    {currUser.role === 'admin' && (
                        <Tooltip title={<TooltipText>Admin Dashboard</TooltipText>}>
                            <StyledIconButton color='inherit' onClick={handleClickAdmin}>
                                <Security />
                            </StyledIconButton>
                        </Tooltip>
                    )}
                    <Tooltip title={<TooltipText>Profile</TooltipText>}>
                        <StyledIconButton color='inherit' onClick={handleClickMenu}>
                            <Person />
                        </StyledIconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <ProfileItem onClick={handleClickProfile}>My Profile</ProfileItem>
                        <ProfileItem onClick={handleClickLogout}>Logout</ProfileItem>
                    </Menu>
                </ButtonsContainer>
            </StyledToolbar>
        </Navbar>
    );
}

export default Header;