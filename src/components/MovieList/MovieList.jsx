import React from 'react'
import { Grid } from '@mui/material'

import { Movie } from '../index'

import useStyles from './styles'

// consider migrating movieList into movies (may be unnecessary component)
const MovieList = ({ movies, numberOfMovies, excludeFirst }) => {
  const classes = useStyles()
  const movieStart = excludeFirst ? 1 : 0

  return (
    <Grid container className={classes.movieContainer}>
      {movies?.slice(movieStart, numberOfMovies).map((movie, i) => (
        <Movie key={i} movie={movie} i={i} />
      ))}
    </Grid>
  )
}

export default MovieList
