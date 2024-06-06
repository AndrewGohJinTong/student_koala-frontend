import { createTheme } from '@mui/material';
import { config } from '../configuration/config';

const baseTheme = ({
    mode,
    background,
    light,
    dark,
}) => ({
    palette: {
        mode: mode,
        primary: {
            main: config.colors.primary,
            light: light,
            dark: dark,
        },
        secondary: {
            main: config.colors.secondary,
        },
        background: {
            default: background,
        },
    },
});

export const lightTheme = createTheme(
    baseTheme({
        mode: 'light',
        background: '#fafafa',
        light: '#fafafa',
        dark: '#181818',
    })
);

export const darkTheme = createTheme(
    baseTheme({
        mode: 'dark',
        background: '#212121',
        light: '#181818',
        dark: '#fafafa',
    })
);
