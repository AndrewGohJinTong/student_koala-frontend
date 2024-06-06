import { FormControl, InputLabel, LinearProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { styled } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { userCreateSchema } from '../../helpers/formValidationSchema';
import dayjs from 'dayjs';
import apiClient from '../../api/apiClient';
import {
    ComplexFieldsContainer,
    FormContainer,
    StyledFormField,
    StyledSelect,
    StyledTextField,
} from '../../styles/formStyles';
import FormButtons from './FormButtonsContainer';

const StyledInputLabel = styled(InputLabel)`
  margin-top: 1vh;
`;

const RegisterUserForm = ({ role, setPopupOpen, loadData }) => {
    const [birthday, setBirthday] = useState(new Date());
    const [currCareGroupIndex, setCurrCareGroupIndex] = useState('');
    const [careGroups, setCareGroups] = useState([]);

    const { currUser, setErrorMessage, setErrorVisible } = useContext(AppContext);
    useEffect(() => {
        apiClient
          .get(`/caregroup/user/${currUser.userID}`)
          .then((res) => setCareGroups(res.data.careGroups));
        // eslint-disable-next-line
    }, []);

    const initialValues = {
        firstName: '',
        lastName: '',
        gender: 'male',
        birthday: DateTime.now().toLocaleString(DateTime.DATE_SHORT),
        role: role,
        phone: '',
        email: '',
    };

    const handleChangeBirthday = (newBirthday) => {
//         console.log(newBirthday.toLocaleString(DateTime.DATE_SHORT));
//         console.log(typeof newBirthday)
//         console.log(DateTime.now().toLocaleString(DateTime.DATE_SHORT));
//         setBirthday(newBirthday ? DateTime.fromJSDate(newBirthday) : null);
        setBirthday(newBirthday);
    };

    const handleChangeCareGroup = (event) => {
        setCurrCareGroupIndex(event.target.value);
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        if (!currCareGroupIndex && values.role === 'patient') {
            setErrorMessage('Please select a care group');
            setErrorVisible(true);
            return;
        }

        setSubmitting(true);
        values.birthday = birthday
            ? birthday.toLocaleString(DateTime.DATE_SHORT)
            : DateTime.now().toLocaleString(DateTime.DATE_SHORT);
        try {
              const registerRes = await apiClient.post('/register', values);

              if (role === 'patient') {
                await apiClient.put('/careGroup', {
                  userID: registerRes.data.userID,
                  careGroupID: careGroups[parseInt(currCareGroupIndex)].groupID,
                });
              }

            setPopupOpen(false);
            loadData();
        } catch (err) {
            console.log(err);
            //   handleError(err, setErrorMessage, setErrorVisible);
        }

        setSubmitting(false);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Formik initialValues={initialValues} validationSchema={userCreateSchema} onSubmit={handleFormSubmit}>
                {({ submitForm, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <Field component={StyledFormField} name="firstName" label="First Name" />
                            <Field component={StyledFormField} name="lastName" label="Last Name" /> 
                            <Field component={StyledFormField} name="email" label="Email Address" />
                            <Field component={StyledFormField} name="phone" label="Phone Number" />
                            <ComplexFieldsContainer>
                                <Field component={StyledSelect} name="gender" label="Gender">
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="notstated">Prefer not to say</MenuItem>
                                </Field>
                                {role === 'patient' && (
                                    <>
                                        <DatePicker 
                                            label="Birthday"
                                            inputFormat="dd/MM/yyyy"
                                            value={birthday}
                                            onChange={handleChangeBirthday}
                                            renderInput={(params) => <StyledTextField {...params} />}
                                        />
                                        <FormControl fullWidth>
                                            <StyledInputLabel id="care-group-select">Care Group</StyledInputLabel>
                                            <Select
                                                labelId="care-group-select"
                                                label="Care Group"
                                                value={currCareGroupIndex}
                                                onChange={handleChangeCareGroup}
                                                placeholder='Select a care group'
                                                sx={{ margin: '1vh 0'}}
                                            >
                                                {careGroups.map((careGroup, index) => (
                                                    <MenuItem key={index} value={index.toString()}>
                                                        {careGroup.groupName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </>
                                )}
                            </ComplexFieldsContainer>
                            {isSubmitting && <LinearProgress />}
                            <FormButtons 
                                isSubmitting={isSubmitting}
                                cancelCallback={() => setPopupOpen(false)}
                                submitForm={submitForm}
                                submitText={`Add ${role}`}
                            />
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </LocalizationProvider>
    );
};

export default RegisterUserForm;
