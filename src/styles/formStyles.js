import { Box, Button, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { Select, TextField as FormikTextField } from 'formik-mui';

export const FormContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 20vw;
`;

export const ComplexFieldsContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    margin: 1vh 0 0;
`;

export const StyledFormField = styled(FormikTextField)`
    margin: 1vh 0;
`;

export const StyledNumberField = styled(FormikTextField)`
    margin: 1vh 0;
`;

export const StyledTextField = styled(TextField)`
    margin: 1vh 0;
`;

export const StyledSelect = styled(Select)`
    margin-bottom: 1vh;
`;

export const FormButtonsContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
`;

export const CancelButton = styled(Button)`
    margin: 2vh 0;
    width: 40%;
`;

export const ConfirmButton = styled(CancelButton)`
    &:hover {
        background-color: ${({ theme }) => theme.palette.secondary.main};
    }
`;
