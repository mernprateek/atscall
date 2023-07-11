import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import { SaveAlt as SaveAltIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import './App.css'; // Import the CSS file
function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [audio, setAudio] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [audioPlayerOpen, setAudioPlayerOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('');

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('audio', audio);
      formData.append('phoneNumber', phoneNumber);
      formData.append('name', name);
      formData.append('date', date);

      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Call recording uploaded successfully.');
        setPhoneNumber('');
        setName('');
        setDate('');
        setAudio(null);
      } else {
        alert('Failed to upload call recording.');
      }
    } catch (error) {
      console.error('Error uploading call recording:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('query', searchQuery);
      queryParams.append('startDate', startDate);
      queryParams.append('endDate', endDate);

      const response = await fetch(`http://localhost:3001/search?${queryParams}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching call recordings:', error);
    }
  };

  const handlePlayRecording = (audioFilePath) => {
    setSelectedAudio(audioFilePath);
    setAudioPlayerOpen(true);
  };

  const handleCloseAudioPlayer = () => {
    setSelectedAudio('');
    setAudioPlayerOpen(false);
  };

  return (
    <div>
      <h1>Call Recording Dashboard</h1>

      <div className="create-entry">
        <h2>Upload Call Recording</h2>
        <TextField
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          label="Phone Number"
        />
        <TextField
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Name"
        />
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
         
        />
        <input type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files[0])} />
        <Button variant="contained" color="primary" onClick={handleUpload}>
          Upload
        </Button>
      </div>

      <div className="search-panel">
        <h2>Search Call Recordings</h2>
        <div className="search-form">
          <TextField
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Search by phone number or name"
            className="search-field"
          />
          <TextField
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="search-field"
          />
          <TextField
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="search-field"
          />
          <Button variant="contained" color="primary" onClick={handleSearch} className="search-button">
            Search
          </Button>
        </div>

        <Grid container spacing={2} className="table-container">
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((result) => (
                  <TableRow key={result._id}>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.phoneNumber}</TableCell>
                    <TableCell>{result.date}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handlePlayRecording(result.audioFilePath)}>
                        <PlayArrowIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </div>

      <Dialog open={audioPlayerOpen} onClose={handleCloseAudioPlayer}>
        <DialogTitle>Audio Player</DialogTitle>
        <DialogContent>
          <audio src={`http://localhost:3001/${selectedAudio}`} controls />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAudioPlayer} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
 