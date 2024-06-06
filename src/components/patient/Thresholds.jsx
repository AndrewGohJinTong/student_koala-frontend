import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Container } from '../../styles/styles';
import apiClient from '../../api/apiClient'; 
import { useParams } from 'react-router-dom';

const thresholdsList = ['usage', 'ahi', 'spo2', 'temp', 'tilt'];

const Thresholds = () => {
  const [thresholdData, setThresholdData] = useState([]);
  const [selectedThreshold, setSelectedThreshold] = useState(thresholdsList[0]);
  const [values, setValues] = useState({
    lowerValue: '',
    upperValue: '',
    comments: '',
    active: false,
  });
  const { patientID } = useParams();

  useEffect(() => {
    apiClient.get(`/threshold/${patientID}`)
      .then(response => {
        setThresholdData(response.data);
      })
      .catch(err => {
        throw(err)
      });
  }, [patientID, selectedThreshold]);

  const thresholdDisplayTitles = {
    usage: 'Usage',
    ahi: 'AHI',
    spo2: 'SpO2',
    temp: 'Temp',
    tilt: 'Tilt'
  };

  

  // Find the data for the selected threshold
//   const selectedData = thresholdData.find(data => data.measurement === selectedThreshold) || {};
  // useMemo for selectedData
  const selectedData = useMemo(() => {
    return thresholdData.find(data => data.measurement === selectedThreshold) || {};
  }, [thresholdData, selectedThreshold]); // Only recalculate selectedData if thresholdData or selectedThreshold changes



  // Update local state when selectedData changes
  useEffect(() => {
    setValues({
      lowerValue: selectedData.lowerValue || '',
      upperValue: selectedData.upperValue || '',
      comments: selectedData.comments || '',
      active: selectedData.active || false,
    });
  }, [selectedData]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSwitchChange = (event) => {
    setValues({ ...values, active: event.target.checked });
  };

  const handleSave = () => {
    const requestBody = {
      measurement: selectedThreshold,
      lowerValue: values.lowerValue === '' ? null : Number(values.lowerValue),
      upperValue: values.upperValue === '' ? null : Number(values.upperValue),
      comments: values.comments,
      patientID: patientID,
      isActive: values.active,
    };
    apiClient.put('/threshold', requestBody)
      .catch(err => {
        throw(err)
      });
  };

  return (
    <Container>
        <Box sx={{ display: 'flex', height: '100%', mt: 3 }}>
            <Box sx={{ width: '200px', marginRight: '2rem' }}>
            <List component="nav" aria-label="mailbox folders">
            <ListItem button selected={selectedThreshold === 'usage'} onClick={() => setSelectedThreshold('usage')}>
                <ListItemText primary="Usage" />
            </ListItem>
            <Divider />
            <ListItem button selected={selectedThreshold === 'ahi'} onClick={() => setSelectedThreshold('ahi')}>
                <ListItemText primary="AHI" />
            </ListItem>
            <Divider />
            <ListItem button selected={selectedThreshold === 'spo2'} onClick={() => setSelectedThreshold('spo2')}>
                <ListItemText primary="SpO2" />
            </ListItem>
            <Divider />
            <ListItem button selected={selectedThreshold === 'temp'} onClick={() => setSelectedThreshold('temp')}>
                <ListItemText primary="Temp" />
            </ListItem>
            <Divider />
            <ListItem button selected={selectedThreshold === 'tilt'} onClick={() => setSelectedThreshold('tilt')}>
                <ListItemText primary="Tilt" />
            </ListItem>
            </List>
        </Box>
            

            <Paper elevation={3} sx={{ flexGrow: 1, padding: '2rem' }}>
                <Typography variant="h5" gutterBottom>
                    {thresholdDisplayTitles[selectedThreshold]} Thresholds
                </Typography>
                <FormGroup row>
                    <FormControlLabel 
                    control={
                        <Switch 
                        checked={values.active}
                        onChange={handleSwitchChange} 
                        />
                    } 
                    label="Active" 
                    />
                </FormGroup>
                <TextField
                    required
                    id="lower-value"
                    label="Lower value"
                    type="number"
                    value={values.lowerValue} 
                    InputProps={{
                        endAdornment: <Typography variant="body2">{selectedData.unit}</Typography>,
                    }}
                    margin="normal"
                    fullWidth
                    onChange={handleChange('lowerValue')}
                />
                <TextField
                    required
                    id="upper-value"
                    label="Upper value"
                    type="number"
                    value={values.upperValue} 
                    InputProps={{
                        endAdornment: <Typography variant="body2">{selectedData.unit}</Typography>,
                    }}
                    margin="normal"
                    fullWidth
                    onChange={handleChange('upperValue')}
                />
                <TextField
                    id="comment"
                    label="Comment"
                    multiline
                    rows={4}
                    value={values.comments} 
                    margin="normal"
                    fullWidth
                    onChange={handleChange('comments')}
                />
                <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={handleSave}
                >
                    Save
                </Button>
            </Paper>
        </Box>
    </Container>
  );
};

export default Thresholds;
