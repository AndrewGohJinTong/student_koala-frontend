import React, { useState, useEffect, useContext } from 'react';
import { LinearProgress, Box, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import apiClient from "../../api/apiClient";
import { handleError } from "../../helpers/helpers";
import { StyledContainer, StyledMetadata, SmallerText, StyledContents } from "../../styles/patientStyles";
import { StyledTypography } from '../../styles/styles';
import { AppContext } from '../../context/AppContext';


const StyledNoteTitle = styled(StyledTypography)`
    font-weight: bold;
`;

const NotesList = styled(Box)`
    height: 240px;
    width: 300px;
    overflow-y: auto; 
    box-sizing: border-box;
`;

const NotesSummary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [notes, setNotes] = useState([]);
    const { setErrorMessage, setErrorVisible } = useContext(AppContext);
    const navigate = useNavigate();

    const loadNotes = () => {
        setIsLoading(true);
        apiClient.get('/clinicianNotes',)
            .then((res) => {
                const unresolvedNotes = res.data.notes.filter(note=>!note.isResolved);
                setNotes(unresolvedNotes)
            })
            .catch((err) => {
                handleError(err, setErrorMessage, setErrorVisible);
                navigate('/', {replace: true});
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadNotes();
    }, []);

    if (isLoading) {
        return <LinearProgress />;
    }

    return (
        <StyledContainer>
            <StyledNoteTitle style={{fontSize: "20px"}}>Notes</StyledNoteTitle>
            <NotesList>
                {notes.map((note) => (
                    <StyledContainer key={note.noteID} onClick={() => navigate(`/patient/${note.patient.userID}`)} style={{ cursor: 'pointer' }}>                        
                        <StyledMetadata key={note.noteID}>
                        <Box style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <StyledNoteTitle>
                            {`${note.patient.userData.firstName} ${note.patient.userData.lastName}`}
                        </StyledNoteTitle>
                        <SmallerText style={{ marginLeft: '8px' }}> 
                            {DateTime.fromISO(note.creationDate).toLocaleString(DateTime.DATE_SHORT)}
                            {note.creationDate !== note.updatedOn && (
                                <>, last edited: {DateTime.fromISO(note.updatedOn).toLocaleString(DateTime.DATE_SHORT)}</>
                            )}
                        </SmallerText>
                        </Box>
                        </StyledMetadata>
                            <Box >
                            <StyledContents>{note.description}</StyledContents>
                            </Box>
                    </StyledContainer>
                ))}
            </NotesList>
        </StyledContainer>
    );
};

export default NotesSummary;
