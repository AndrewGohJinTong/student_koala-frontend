import { Box, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import { Field, Form, Formik } from 'formik';
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { clinicalNoteCreateSchema } from '../../helpers/formValidationSchema';
import { handleError } from '../../helpers/helpers';
import { StyledFormField } from '../../styles/formStyles';
import FormButtons from './FormButtonsContainer';
import apiClient from '../../api/apiClient';

const FormContainer = styled(Box)`
    width: 20vw;
`;

const NoteForm = ({ patientID, setPopupOpen, loadData, noteID, desc, isEdit }) => {
    const { currUser, setErrorMessage, setErrorVisible } = useContext(AppContext);

    // Hard coding user id to test clinician
    // TODO: figure out how to set app context
    const initialValues = {
        patientID,
        clinicianID: currUser.userID,
        // clinicianID: 6,
        description: isEdit ? desc : '',
    };
    // console.log(initialValues.description);

    const handleFormSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);

        // const request = [];
        const request = isEdit
            ? apiClient.put('/notes', { noteID, isResolved: false, description: values.description })
            : apiClient.post('/notes', values);

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
            <Formik initialValues={initialValues} validationSchema={clinicalNoteCreateSchema} onSubmit={handleFormSubmit}>
                {({ submitForm, isSubmitting }) => (
                    <Form>
                        <Field name="description" label="Description">
                            {(fieldProps) => <StyledFormField {...fieldProps} fullWidth multiline minRows={3} />}
                        </Field>
                        {isSubmitting && <LinearProgress />}
                        <FormButtons
                            isSubmitting={isSubmitting}
                            cancelCallback={() => setPopupOpen(false)}
                            submitForm={submitForm}
                            submitText={isEdit ? 'Edit Note' : 'Create Note'}
                        />
                    </Form>
                )}
            </Formik>
        </FormContainer>
    );
};

export default NoteForm;