import { styled } from '@mui/system';
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import { handleError } from '../../helpers/helpers';
import { AccordionDetails, LinearProgress } from '@mui/material';
import apiClient from '../../api/apiClient';
import Note from './Note';
import { StyledTypography } from '../../styles/styles';

const AccordionTitle = styled(StyledTypography)`
    font-weight: bold;
    margin-left: 1vw;
`;

const ArchivedNotes = ({ patientID}) => {
    const { currUser, setErrorMessage, setErrorVisible } = useContext(AppContext);


    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);



    const loadNotes = () => {
        setIsLoading(true);
        apiClient.get(`/notes/${patientID}`)
            .then((res) => {
                // console.log(res);
                const notes = res.data.notes.filter(note => note.isResolved);
                setNotes(notes);

            })
            .catch((err) => handleError(err, setErrorMessage, setErrorVisible))
            .finally(() => setIsLoading(false));
    };
    useEffect(()=> {
        loadNotes();
        // eslint-disable-next-line
    }, []);


    if (isLoading) {
        return <LinearProgress />;
    }


    return (
        <>
            <AccordionTitle>Archived Notes</AccordionTitle>
            <AccordionDetails>
                {notes.length > 0
                    ? notes.map((note) => <Note note={note}/>)
                    : 'No clinical notes found'}
            </AccordionDetails>
        </>
    );
};

export default ArchivedNotes;