import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

import { useGetPersonQuery } from '../../services/TMDB'
import useStyles from '../styles'

const Actors = () => {
  const { id } = useParams()
  const { data, isFetching, error } = useGetPersonQuery()

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
        <Link to="/">Something has gone wrong - go back</Link>
      </Box>
    )
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4} />
    </Grid>
  )
}

export default Actors
