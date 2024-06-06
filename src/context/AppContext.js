import { createContext, useState } from "react";

const defaultUser = {
    // Clinician
    auth0ID: '930fdaca095a7f297179fb3dce7206435ece69048342d7c94d0614a09e46ec4b',
    // Admin
    // auth0ID: '4f8a189ef0fd957582883adedb6ecf97e66ab1f77c2047140ee3332ade3654c4',
    userID: 17,
    firstName: 'testy',
    lastName: 'aest',
    gender: 'Male',
    birthday: '',
    phone: '',
    email: '',
    isActive: true,
    // role: 'admin',
    role: 'clinician',
};

export const AppContext = createContext({
    token: '',
    setToken: () => { },
    currUser: defaultUser,
    setCurrUser: () => { },
    isDarkMode: false,
    setIsDarkMode: () => { },
    errorMessage: '',
    setErrorMessage: () => { },
    errorVisible: false,
    setErrorVisible: () => { },
});

const AppContextProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [currUser, setCurrUser] = useState(defaultUser);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);

    const initialContext = {
        token,
        setToken,
        currUser,
        setCurrUser,
        isDarkMode,
        setIsDarkMode,
        errorMessage,
        setErrorMessage,
        errorVisible,
        setErrorVisible,
    };

    return <AppContext.Provider value={initialContext}>{children}</AppContext.Provider>;
};

export default AppContextProvider;