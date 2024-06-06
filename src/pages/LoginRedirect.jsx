import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../configuration/auth';

const LoginRedirect = () => {
    const { instance } = useMsal();

    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };

    useEffect(() => {
        handleLoginRedirect();
        // eslint-disable-next-line
    }, []);

    return <></>;
}

export default LoginRedirect;