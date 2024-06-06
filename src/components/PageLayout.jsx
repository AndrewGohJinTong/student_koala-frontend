import { AuthenticatedTemplate } from "@azure/msal-react";
import { NavigationBar } from "./NavigationBar";
import { darkTheme, lightTheme } from '../styles/theme';
import { GlobalStyles, ThemeProvider } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Header from "./Header";

export const PageLayout = (props) => {
    const { setToken, isDarkMode, errorMessage, errorVisible, setErrorVisible } = useContext(AppContext);

    const theme = isDarkMode ? darkTheme : lightTheme;
    const globalStyle = {
        body: {
            background: theme.palette.background.default,
            transition: 'background 0.2s',
        },
        '::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
        },
        '::-webkit-scrollbar-track': {
            background: theme.palette.background.default,
        },
        '::-webkit-scrollbar-thumb': {
            background: theme.palette.secondary.main,
            borderRadius: '5px',
        },
        '::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.secondary.dark,
        },
    };

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles styles={globalStyle} />
            <Header />
            {/* <NavigationBar /> */}
            {props.children}
            <AuthenticatedTemplate>
                {/* <footer>
                    <center>
                        How did we do?
                        <a
                            href="https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUMlRHSkc5U1NLUkxFNEtVN0dEOTFNQkdTWiQlQCN0PWcu"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {' '}
                            Share your experience!
                        </a>
                    </center>
                </footer> */}
            </AuthenticatedTemplate>
        </ThemeProvider>
    );
}