import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, CardContent, FormControlLabel, Typography, FormControl, InputLabel, Input, FormHelperText, Grid, MenuItem, Select, Chip } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function App() {
  const classes = useStyles();
  const theme = useTheme();

  const topSpeakers = ['barack-obama', 'donald-trump', 'hillary-clinton',
    'mitt-romney', 'scott-walker', 'john-mccain', 'rick-perry',
    'marco-rubio', 'rick-scott', 'ted-cruz'];
  const [speaker, setSpeaker] = React.useState('barack-obama');
  const [open, setOpen] = React.useState(false);

  const [context, setContext] = React.useState('');

  const [statement, setStatement] = React.useState('');

  const topSubjects = ['economy', 'health-care', 'taxes', 'federal-budget', 'education',
    'jobs', 'state-budget', 'candidates-biography', 'elections', 'immigration'];
  const [subjects, setSubjects] = React.useState([]);

  const [probTrue, setProbTrue] = React.useState(-1);

  const [currentAnswer, setCurrentAnswer] = React.useState('');

  function postData() {
    const data = {
      statement: statement,
      subjects: subjects.toString(),
      speaker: speaker,
      context: context,
    };
    axios.post('http://127.0.0.1:5000/', data).then(response => {
      console.log(response);
      const probTrueResp = response.data.probTrue
      const probTrueRespStr = parseFloat(probTrueResp);
      const answer = probTrueResp > 0.5 ? 'True with confidence ' + probTrueRespStr : 'False with confidence ' + probTrueRespStr;
      setProbTrue(probTrueResp);
      setCurrentAnswer(answer);
    }).catch(e => {
      console.log(e);
    })
  }

  const handleChange = (event) => {
    setSpeaker(event.target.value);
  };

  const handleSubjectsChange = (event) => {
    setSubjects(event.target.value)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Container style={{ textAlign: 'center' }}>
      <h1>Need Catchy Title</h1>
      <Grid container justify='center' direction='column'>
        <Grid item>
          <TextField required id="standard-required" label="Statement" onChange={event => setStatement(event.target.value)} />
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-chip-label">Subjects</InputLabel>
            <Select
              labelId="demo-mutiple-chip-label"
              id="demo-mutiple-chip"
              multiple
              value={subjects}
              onChange={handleSubjectsChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {topSubjects.map((name) => (
                <MenuItem key={name} value={name} style={getStyles(name, subjects, theme)}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl>
            <InputLabel id="demo-controlled-open-select-label">Speaker</InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={speaker}
              onChange={handleChange}
            >
              {
                topSpeakers.map(speaker => (
                  <MenuItem value={speaker}>
                    {speaker}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField required id="standard-required" label="Context" onChange={event => setContext(event.target.value)} />
        </Grid>
        <Grid item>
          <Button onClick={postData}>Classify</Button>
        </Grid>
      </Grid>
      <h1>Classification</h1>
      <Card>
        <CardContent>
          {currentAnswer}
        </CardContent>
      </Card>
    </Container >
  );
}
