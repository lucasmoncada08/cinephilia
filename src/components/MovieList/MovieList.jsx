import React from 'react'
import { Grid } from '@mui/material'

import { Movie } from '../index'

import useStyles from './styles'

const MovieList = ({ movies }) => {
  const classes = useStyles()
  console.log('movie list')

  return (
    <Grid container className={classes.movieContainer}>
      {movies?.results?.map((movie, i) => (
        <Movie key={i} movie={movie} i={i} />
      ))}
    </Grid>
  )
}

export default MovieList
