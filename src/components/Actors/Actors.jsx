import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, CircularProgress, Grid, Typography, Button } from '@mui/material'
import { Theaters, ArrowBack } from '@mui/icons-material'
import moment from 'moment'

import { useGetPersonQuery } from '../../services/TMDB'
import { MovieList } from '../index'
import useStyles from './styles'

const Actors = () => {
  const { id } = useParams()
  const { data, isFetching, error } = useGetPersonQuery(id)
  const page = 1

  console.log({ data })

  const classes = useStyles()

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button variant="outlined" size="large" endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
          <Typography component={Link} to="/" color="inherit" variant="subtitle2" style={{ textDecoration: 'none' }}>
            Back
          </Typography>
        </Button>
      </Box>
    )
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4} style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w780/${data.profile_path}`}
        />
      </Grid>
      <Grid item container direction="column" lg={7} style={{ justifyContent: 'center' }}>
        <Typography variant="h3" align="center" gutterBottom>
          {data.name}
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          Born: {moment(data.birthday).format('MMM Do, YYYY')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {data?.biography?.length > 1250 ? data?.biography?.slice(0, 1250).concat('...') : data?.biography || 'Sorry, no biography available yet.'}
        </Typography>
        <Grid item container style={{ marginTop: '2rem' }}>
          <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
            <Button variant="contained" size="medium" target="_blank" rel="noopener noreferrer" href={`https://www.imdb.com/name/${data?.imdb_id}`} endIcon={<Theaters />}>IMDB</Button>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
            <Button variant="outlined" size="medium" endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
              <Typography component={Link} to="/" color="inherit" variant="subtitle2" style={{ textDecoration: 'none' }}>
                Back
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          Movies
        </Typography>
        <MovieList movies={data?.movie_credits?.cast} numberOfMovies={12} />
      </Box>
    </Grid>
  )
}

export default Actors
