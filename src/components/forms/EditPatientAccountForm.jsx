import { LinearProgress, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Field, Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { userEditSchema } from '../../helpers/formValidationSchema';
import { handleError } from '../../helpers/helpers';
import {
    ComplexFieldsContainer,
    FormContainer,
    StyledFormField,
    StyledSelect,
    StyledTextField,
} from '../../styles/formStyles';
import FormButtons from './FormButtonsContainer';
import apiClient from '../../api/apiClient';

const EditPatientAccountForm = ({ patient, setPopupOpen, loadData }) => {
    const [birthday, setBirthday] = useState(DateTime.fromISO(patient.birthday));

    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const { userID, gender, phone, email } = patient;

    const initialValues = {
        userID,
        gender,
        birthday: patient.birthday,
        phone,
        email,
    };

    const handleChangeBirthday = (newBirthday) => {
        setBirthday(newBirthday ? DateTime.fromJSDate(newBirthday) : null);
    };

    const handleFormSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);
        values.birthday = birthday
            ? birthday.toLocaleString(DateTime.DATE_SHORT)
            : DateTime.now().toLocaleString(DateTime.DATE_SHORT);

        apiClient.put('/user', values)
            .then(() => {
                loadData();
                setPopupOpen(false);
            })
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setSubmitting(false));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Formik initialValues={initialValues} validationSchema={userEditSchema} onSubmit={handleFormSubmit}>
                {({ submitForm, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <Field component={StyledFormField} name="email" label="Email address" />
                            <Field component={StyledFormField} name="phone" label="Phone number" />
                            <ComplexFieldsContainer>
                                <Field component={StyledSelect} name="gender" label="Gender">
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Indeterminate/Other</MenuItem>
                                    <MenuItem value="notstated">Not Stated</MenuItem>
                                </Field>
                            </ComplexFieldsContainer>
                        </FormContainer>
                        {isSubmitting && <LinearProgress />}
                        <FormButtons
                            isSubmitting={isSubmitting}
                            cancelCallback={() => setPopupOpen(false)}
                            submitForm={submitForm}
                            submitText="Save Changes"
                        />
                    </Form>
                )}
            </Formik>
        </LocalizationProvider>
    );
};

export default EditPatientAccountForm;