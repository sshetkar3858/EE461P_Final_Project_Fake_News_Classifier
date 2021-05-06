import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Button, CardContent, FormControlLabel, Typography, FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import axios from 'axios';
 
export default function App() {
  const [artistName, setArtistName] = useState('');
  const [songName, setSongName] = useState('');
  const [albumName, setAlbumName] = useState('');

  const [beatsPerMeasure, setBeatsPerMeasure] = useState(0);
  const [beatsPerMinute, setBeatsPerMinute] = useState(0);
  const [lengthInMinutes, setLengthInMinutes] = useState(0);
  const [lyricism, setLyricism] = useState(0);
  const [volume, setVolume] = useState(0);

  const [danceability, setDanceability] = useState(0);
  const [positivity, setPositivity] = useState(0);
  const [hype, setHype] = useState(0);
  const [instrumentalness, setInstrumentalness] = useState(0);

  const [vulgarity, setVulgarity] = useState(false) // false = not vulgar, true = vulgar
  const [concertProbability, setConcertProbability] = useState(0);

  const [auditory, setAuditory] = useState(0)
  const [majorMinor, setMajorMinor] = useState(false) // false = minor, true = major

  const [styles, setStyles] = useState('rock') // default to rock
  const [tone, setTone] = useState('C') // default to C

  const [streamNum, setStreamNum] = useState('-')
  const [review, setReview] = useState('-')




  function errorCheckStringToInt(value) {
    let ret = 0
    try {
      ret = parseInt(value)
    }
    catch(error) {
      console.log(error)
    }
    return ret;
  }

  function errorCheckStringToFloat(value) {
    let ret = 0
    try {
      ret = parseFloat(value)
    }
    catch(error) {
      console.log(error)
    }
    return ret;
  }

  function postData() {
      const data = {
          artist: artistName,
          name: songName,
          album: albumName,
          beats_per_measure: beatsPerMeasure,
          beats_per_min: beatsPerMinute,
          length_minutes: lengthInMinutes,
          lyricism: lyricism,
          volume: volume,
          danceability: danceability,
          positivity: positivity,
          hype: hype,
          instrumentalness: instrumentalness,
          styles: styles,
          'major/minor': majorMinor ? 'major' : 'minor',
          vulgar: vulgarity ? 'VULGAR' : 'NOT VULGAR',
          concert_probability: concertProbability,
          auditory: auditory,
          tone: tone
      }
      console.log(data)
      axios.post('http://127.0.0.1:5000/api/model', data).then(response => {
          setStreamNum(response.data.stream)
          setReview(response.data.rev);
      }).catch(e => {
          console.log(e);
      })
  }

    return (
        <Container style={{textAlign: 'center'}}>
					<h1>Need Catchy Title</h1>
					<Card>
						<TextField id="standard-basic" label="Standard" />
						
					</Card>
					<h1>Classification</h1>
					<Card>
							<CardContent>
							</CardContent>
					</Card>
        </Container>
    );
}
