import React from 'react'
import { CancelButton, ConfirmButton, FormButtonsContainer } from '../../styles/formStyles';

const FormButtons = ({ isSubmitting, cancelCallback, submitForm, submitText }) => {
    return (
        <FormButtonsContainer>
            <CancelButton variant='outlined' disabled={isSubmitting} onClick={cancelCallback}>
                Cancel
            </CancelButton>
            <ConfirmButton variant='contained' disabled={isSubmitting} onClick={submitForm}>
                {submitText}
            </ConfirmButton>
        </FormButtonsContainer>
    );
};

export default FormButtons;