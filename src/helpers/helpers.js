export const capitaliseFirstLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const getName = (u) => (u ? `${u.firstName} ${u.lastName}` : '');

export const handleError = (err, setErrorMessage, setErrorVisible) => {
    if (err) {
        setErrorMessage(err.response?.data.message);
    } else {
        if (err.hasOwnProperty('message')) {
            setErrorMessage(err.message);
        } else {
            setErrorMessage(JSON.stringify(err));
        }
    }

    setErrorVisible(true);
};

export const stringToColour = (s) => {
    let hash = 0;
    let i;

    for (i = 0; i < s.length; i += 1) {
        hash = s.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
};

export const stringAvatar = (name, isProfile) => ({
    sx: {
        bgcolor: stringToColour(name),
        color: '#000000',
        p: isProfile ? '2.5vh' : 1,
        fontSize: isProfile ? '30px' : '20px',
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
});

export const getUnit = (measurement) => {
    const units = {
        Usage: ' hour(s)',
        AHI: ' event(s)/hour',
        SpO2: '%',
        Temperature: '°C',
        'Head Tilt': '°',
    };

    return units[measurement];
};

export const twoDP = (x) => (x ? parseFloat(x.toFixed(2)) : x);