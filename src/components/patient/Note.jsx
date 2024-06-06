import { Edit } from '@mui/icons-material';
import { IconButton, Checkbox } from '@mui/material';
import { Box, styled } from '@mui/system';
import { DateTime } from 'luxon';
import React from 'react';
import { SmallerText, StyledContainer, StyledContents } from '../../styles/patientStyles';
import { StyledTypography } from '../../styles/styles';

const StyledNoteTitle = styled(StyledTypography)`
    font-weight: bold;
`;

const StyledIconButton = styled(IconButton)`
    margin-left: 1vw;
`;


const StyledNotesArchive = styled(Box)`
    display: flex;
    align-items: center;
`;

const StyledNoteDescription = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;


const StyledMetadata = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    display: flex;
    margin-bottom: 1vh;
`;

const Note = ({ note, handleEditNote, handleMarkNotesArchived }) => {
    const handleArchiveClick = (event) => {
        if (handleMarkNotesArchived) {
            handleMarkNotesArchived(note.noteID, event.target.checked);
        }
    };
    
    const handleEditClick = () => {
        if (handleEditNote) {
            handleEditNote(note.noteID, note.description);
        }
    }

    return (
        <StyledContainer>
            <StyledNoteDescription>
                <StyledMetadata>
                    <StyledNoteTitle>{`${note.clinician.userData.firstName} ${note.clinician.userData.lastName}`} </StyledNoteTitle>
                    <SmallerText>
                        {DateTime.fromISO(note.creationDate).toLocaleString(DateTime.DATE_SHORT)}
                        {note.creationDate !== note.updatedOn && (
                            <>, last edited: {DateTime.fromISO(note.updatedOn).toLocaleString(DateTime.DATE_SHORT)}</>
                        )}
                    </SmallerText>
                </StyledMetadata>
                {handleEditNote && (
                    <StyledIconButton onClick={handleEditClick}>
                        <Edit />
                    </StyledIconButton>
                )}
            </StyledNoteDescription>
            <Box>
            <StyledNoteDescription>
                    <StyledContents>{note.description}</StyledContents>
                    {handleMarkNotesArchived && (
                        <StyledNotesArchive>
                            Archive
                            <Checkbox checked={note.isResolved} onClick={handleArchiveClick} />
                        </StyledNotesArchive>
                    )}
                </StyledNoteDescription>
            </Box>
        </StyledContainer>
    );
};

export default Note;