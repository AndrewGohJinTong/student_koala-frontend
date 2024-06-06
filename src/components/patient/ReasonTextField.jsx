import { styled } from '@mui/system';
import React from 'react';
import { StyledTextField } from '../../styles/formStyles';

const ReasonField = styled(StyledTextField)`
    margin-bottom: 2vh;
`;

const ReasonTextField = (props) => (
    <ReasonField {...props} placeholder="Reason for change" fullWidth multiline minRows={3} />
);

export default ReasonTextField;