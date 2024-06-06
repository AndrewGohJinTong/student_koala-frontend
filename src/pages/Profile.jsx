import { Edit } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    LinearProgress,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField as FormField } from 'formik-mui';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { userEditSchema } from '../helpers/formValidationSchema';
import { capitaliseFirstLetter, getName, handleError, stringAvatar } from '../helpers/helpers';
import { FormContainer } from '../styles/formStyles';
import { Container, StyledTypography } from '../styles/styles';
import FormButtons from '../components/forms/FormButtonsContainer';

const ProfileContainer = styled(Container)`
    align-items: center;
`;

const StyledName = styled(StyledTypography)`
    text-align: center;
    font-weight: bold;
    font-size: 1.5rem;
    margin-top: 2vh;
`;

const HeadingContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 30vw;
    color: ${({ theme }) => theme.palette.primary.dark};
`;

const Heading = styled(StyledTypography)`
    font-weight: bold;
    font-size: 1.25rem;
    margin-top: 4vh;
    margin-bottom: 2vh;
    width: 30vw;
`;

const ProfileFormContainer = styled(FormContainer)`
    width: 30vw;
`;

const Label = styled(StyledTypography)`
    font-size: 1.05rem;
    margin-top: 1.5vh;
`;

const StyledTextField = styled(TextField)`
    margin: 0.5vh 0;
`;

const StyledFormField = styled(FormField)`
    margin: 0.5vh 0;
`;

const OverrideDisabledTextField = styled(StyledTextField)(({ theme }) => ({
    '.MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: theme.palette.primary.dark,
        color: theme.palette.primary.dark,
    },
}));

const OverrideDisabledFormField = styled(StyledFormField)(({ theme }) => ({
    '.MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: theme.palette.primary.dark,
        color: theme.palette.primary.dark,
    },
}));

const SecurityButtonsContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 30vw;
`;

const SecurityButton = styled(Button)`
    margin: 1vh 0 2vh;
    align-self: flex-start;
    padding: 1vh;
    width: 10vw;
`;

const ChangePasswordButton = styled(SecurityButton)`
    &:hover {
        background-color: ${({ theme }) => theme.palette.secondary.main};
    }
`;

const ChangePasswordText = styled(StyledTypography)`
    margin-bottom: 1vh;
`;

const DeactivateAccountText = styled(StyledTypography)`
    text-align: center;
    margin-bottom: 2vh;
`;

const DeactivateButtonsContainer = styled(Box)`
    display: flex;
    margin: 5vh 0 0;
    justify-content: space-between;
`;

const DeactivateButton = styled(Button)`
    width: 40%;
`;

const Profile = () => {
    const { currUser, setCurrUser, setErrorMessage, setErrorVisible } = useContext(AppContext);

    const [isEditing, setIsEditing] = useState(false);
    const [gender, setGender] = useState(currUser.gender);
    const [birthday, setBirthday] = useState(DateTime.now());
    const [clickedChangePw, setClickedChangePw] = useState(false);
    const [isConfirmDeactivate, setIsConfirmDeactivate] = useState(false);

    const navigate = useNavigate();

    const initialValues = {
        userID: currUser.userID,
        gender: '',
        birthday: '',
        phone: currUser.phone,
        email: currUser.email,
    };

    const genderOptions = {
        male: 'Male',
        female: 'Female',
        notstated: 'Prefer not to say',
    };

    useEffect(() => {
        setBirthday(DateTime.fromISO(currUser.birthday));
    }, [currUser]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setClickedChangePw(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [clickedChangePw]);

    const handleOpenDialog = () => {
        setIsConfirmDeactivate(true);
    };

    const handleCloseDialog = () => {
        setIsConfirmDeactivate(false);
    };

    const handleEditDetails = () => {
        if (isEditing) {
        } else {
            setIsEditing(true);
        }
    };

    const handleCancelEdit = () => {
        setBirthday(DateTime.fromISO(currUser.birthday));
        setIsEditing(false);
    };

    const handleChangeGender = (event) => {
        setGender(event.target.value);
    };

    const handleChangeBirthday = (newBirthday) => {
        setBirthday(newBirthday ? DateTime.fromJSDate(newBirthday) : null);
    };

    const handleFormSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);

        values.gender = gender;
        values.birthday = birthday
            ? birthday.toLocaleString(DateTime.DATE_SHORT)
            : DateTime.now().toLocaleString(DateTime.DATE_SHORT);

        values.userID = currUser.userID;

        // apiClient
        //     .put('/user', values)
        //     .then(() => {
        //         setIsEditing(false);
        //         setCurrUser({
        //             ...currUser,
        //             gender: gender,
        //             birthday: birthday ? birthday.toISO() : currUser.birthday,
        //             phone: initialValues.phone,
        //             email: initialValues.email,
        //         });
        //     })
        //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
        //     .finally(() => setSubmitting(false));
    };

    const handleChangePassword = () => {
        console.log("Change password");
        // apiClient
        //     .post('/changepw', { email: currUser.email })
        //     .then(() => {
        //         setClickedChangePw(true);
        //     })
        //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible));
    };

    const handleDisableAccount = () => {
        console.log("Disable account");
        // apiClient
        //     .delete(`/user/${currUser.userID}`)
        //     .then(() => logoutHandler(navigate))
        //     .catch((err) => handleError(err, setErrorMessage, setErrorVisible));
    };

    return (
        <ProfileContainer>
            <Avatar {...stringAvatar(getName(currUser), true)} />
            <StyledName>{getName(currUser)}</StyledName>
            <HeadingContainer>
                <Heading>My Profile</Heading>
                <IconButton color='inherit' onClick={handleEditDetails}>
                    {!isEditing && <Edit />}
                </IconButton>
            </HeadingContainer>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={userEditSchema}
                    onSubmit={handleFormSubmit}
                    enableReinitialize
                >
                    {({ submitForm, isSubmitting, handleReset }) => (
                        <Form>
                            <ProfileFormContainer>
                                <Label>Role</Label>
                                <OverrideDisabledTextField value={capitaliseFirstLetter(currUser.role)} disabled />
                                <Label>Email</Label>
                                <Field component={OverrideDisabledFormField} name='email' disabled={!isEditing} />
                                <Label>Phone Number</Label>
                                <Field component={OverrideDisabledFormField} name='phone' disabled={!isEditing} />
                                {isEditing ? (
                                    <>
                                        <Label>Gender</Label>
                                        <Select
                                            value={gender}
                                            onChange={handleChangeGender}
                                            disabled={!isEditing}
                                            sx={{ margin: '0.5vh 0' }}
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                            <MenuItem value="notstated">Prefer not to say</MenuItem>
                                        </Select>
                                        <Label>Birthday</Label>
                                        <DatePicker
                                            inputFormat="dd/MM/yyyy"
                                            value={birthday}
                                            onChange={handleChangeBirthday}
                                            renderInput={(params) => <StyledTextField {...params} />}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Label>Gender</Label>
                                        <OverrideDisabledTextField value={genderOptions[currUser.gender]} disabled />
                                        <Label>Birthday</Label>
                                        <OverrideDisabledTextField
                                            value={DateTime.fromISO(currUser.birthday).toLocaleString(DateTime.DATE_SHORT)}
                                            disabled
                                        />
                                    </>
                                )}
                                {isEditing && (
                                    <FormButtons
                                        isSubmitting={isSubmitting}
                                        cancelCallback={() => {
                                            handleReset();
                                            handleCancelEdit();
                                        }}
                                        submitForm={submitForm}
                                        submitText="Save"
                                    />
                                )}
                                {isSubmitting && <LinearProgress />}
                            </ProfileFormContainer>
                        </Form>
                    )}
                </Formik>
            </LocalizationProvider>
            <Heading>Security</Heading>
            <SecurityButtonsContainer>
                <>
                    <ChangePasswordButton variant="contained" onClick={handleChangePassword}>
                        Change password
                    </ChangePasswordButton>
                    {clickedChangePw && (
                        <ChangePasswordText>An email has been sent to you to reset your password</ChangePasswordText>
                    )}
                </>
                <SecurityButton variant="contained" color="error" onClick={handleOpenDialog}>
                    Deactivate account
                </SecurityButton>
            </SecurityButtonsContainer>
            <Dialog open={isConfirmDeactivate} onClose={handleCloseDialog}>
                <DialogContent>
                    <DeactivateAccountText>Do you really want to deactivate your account?</DeactivateAccountText>
                    <DeactivateAccountText>Administrator accounts cannot be deactivate!</DeactivateAccountText>
                    <DeactivateButtonsContainer>
                        <DeactivateButton variant="outlined" onClick={handleCloseDialog}>
                            No
                        </DeactivateButton>
                        <DeactivateButton
                            variant="contained"
                            color="error"
                            onClick={handleDisableAccount}
                            disabled={currUser.role === 'admin'}
                        >
                            Yes
                        </DeactivateButton>
                    </DeactivateButtonsContainer>
                </DialogContent>
            </Dialog>
        </ProfileContainer>
    );
};

export default Profile;