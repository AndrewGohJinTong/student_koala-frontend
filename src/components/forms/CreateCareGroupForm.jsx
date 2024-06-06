import { LinearProgress } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { careGroupCreateSchema } from '../../helpers/formValidationSchema';
import { FormContainer, StyledFormField } from '../../styles/formStyles';
import FormButtons from './FormButtonsContainer';
import apiClient from '../../api/apiClient';

const CreateCareGroupForm = ({ setPopupOpen, loadData }) => {
    const { setErrorMessage, setErrorVisible } = useContext(AppContext);

    const initialValues = {
        groupName: '',
    };

    const handleFormSubmit = (values, { setSubmitting }) => {
        setSubmitting(true);
        console.log("Post to caregroup")
apiClient
    .post('/caregroup', values)
    .then(() => {
        if (setPopupOpen) setPopupOpen(false);
        if (loadData) loadData();
    })
//     .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .catch((err) => {
                console.error("API call failed:", err);
                setErrorMessage("An error occurred while creating the care group.");
                setErrorVisible(true);
            })
    .finally(() => setSubmitting(false));
    };

    return (
        <Formik initialValues={initialValues} validationSchema={careGroupCreateSchema} onSubmit={handleFormSubmit}>
            {({ submitForm, isSubmitting }) => (
                <Form>
                    <FormContainer>
                        <Field component={StyledFormField} name="groupName" label="Group Name" />
                        {isSubmitting && <LinearProgress />}
                        <FormButtons
                            isSubmitting={isSubmitting}
                            cancelCallback={() => setPopupOpen(false)}
                            submitForm={submitForm}
                            submitText="Create"
                        />
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default CreateCareGroupForm
