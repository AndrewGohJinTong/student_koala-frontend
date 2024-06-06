import { Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import { Field, Form, Formik } from 'formik';
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { clinicalAlertCreateSchema } from '../../helpers/formValidationSchema';
import { handleError } from '../../helpers/helpers';
import { StyledFormField, StyledNumberField } from '../../styles/formStyles';
import FormButtons from './FormButtonsContainer';
import apiClient from '../../api/apiClient';

const FormContainer = styled(Box)`
    width: 20vw;
`;

const AlertForm = ({ patientID, setPopupOpen, loadData, noteID, desc, isEdit }) => {
    const { currUser, setErrorMessage, setErrorVisible } = useContext(AppContext);

    // Hard coding user id to test clinician
    // TODO: figure out how to set app context
    const initialValues = {
        patientID,
        alertName: '',
        description: '',
        alertLevel: 0,

    };
    // console.log(initialValues.description);

    const handleFormSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);

        // const request = [];
        const request = apiClient.post('/alerts', values);
        request
            .then(() => {
                loadData();
                setPopupOpen(false);
            })
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setSubmitting(false));
    };
    return (
        <FormContainer>
            <Formik initialValues={initialValues} validationSchema={clinicalAlertCreateSchema} onSubmit={handleFormSubmit}>
                {({ submitForm, isSubmitting }) => (
                    <Form>
                        <label htmlFor="alertName">Alert Name:</label>
                        <Field name="alertName">
                            {(fieldProps) => <StyledFormField {...fieldProps} fullWidth />}
                        </Field>
                        <label htmlFor="description">Description:</label>
                        <Field name="description">
                            {(fieldProps) => <StyledFormField {...fieldProps} fullWidth />}
                        </Field>
                        <label htmlFor="alertLevel">Alert Level (0-10):</label>
                        <Field name="alertLevel" as="input" type="number" min="0" max="10">
                            {(fieldProps) => <StyledNumberField {...fieldProps} fullWidth />}
                        </Field>
                        {isSubmitting && <LinearProgress />}
                        <FormButtons
                            isSubmitting={isSubmitting}
                            cancelCallback={() => setPopupOpen(false)}
                            submitForm={submitForm}
                            submitText={'Create Alert'}
                        />
                    </Form>
                )}
            </Formik>
        </FormContainer>
    );
};

export default AlertForm;