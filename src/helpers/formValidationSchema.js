import * as yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(yup);

const userCreateFields = {
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email address is required'),
  phone: yup.string().required('Phone number is required'),
};

const userEditFields = {
  email: yup.string().email('Enter a valid email').required('Email address is required'),
  phone: yup.string().required('Phone number is required'),
};

const careGroupCreateFields = {
  groupName: yup.string().required('Group name is required'),
};

const clinicalNoteCreateFields = {
  description: yup.string().required('Description is required'),
};

const clinicalAlertCreateFields = {
  description: yup.string().required('Description is required'),
  alertName: yup.string().required('Alert Name is required'),
  alertLevel: yup.string().required('Alert Level is required'),
}


export const userCreateSchema = yup.object(userCreateFields);
export const userEditSchema = yup.object(userEditFields);
export const careGroupCreateSchema = yup.object(careGroupCreateFields);
export const clinicalNoteCreateSchema = yup.object(clinicalNoteCreateFields);
export const clinicalAlertCreateSchema = yup.object(clinicalAlertCreateFields);
