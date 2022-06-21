import React, { useEffect } from 'react'
import { Divider, List, ListItem, ListItemText, ListItemIcon, Box, CircularProgress, ListSubheader } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/styles'
import { useDispatch, useSelector } from 'react-redux'

import lightLogo from '../../assets/images/Light-Window-Watching-Logo.png'
import darkLogo from '../../assets/images/Dark-Window-Watching-Logo.png'
import genreIcons from '../../assets/genres'

import useStyles from './styles'

import { selectGenreOrCategory } from '../../features/currentGenreOrCategory'
import { useGetGenresQuery } from '../../services/TMDB'

const categories = [
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Upcoming', value: 'upcoming' },
]

const Sidebar = ({ setMobileOpen }) => {
  const { genreIdOrCategoryName } = useSelector((state) => state.currentGenreOrCategory)
  const theme = useTheme()
  const classes = useStyles()
  const { data, error, isFetching } = useGetGenresQuery()

  const dispatch = useDispatch() // transfer info from component to redux

  if (error) {
    return 'Error'
  }

  // console.log({ data })

  return (
    <>
      <Link to="/" className={classes.imageLink}>
        <img
          className={classes.image}
          src={theme.palette.mode === 'light' ? lightLogo : darkLogo}
          alt="Window Watching Logo"
        />
      </Link>
      <Divider />
      <List>
        <ListSubheader>Categories</ListSubheader>
        {categories.map(({ label, value }) => (
          <Link key={value} className={classes.links} to="/">
            <ListItem onClick={() => dispatch(selectGenreOrCategory(value))} button>
              <ListItemIcon>
                <img src={genreIcons[label.toLowerCase()]} className={classes.genreImage} height={30} />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <ListSubheader>Genres</ListSubheader>
        {
          isFetching ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress size="4rem" />
            </Box>
          ) : (
            data.genres.map(({ name, id }) => (
              <Link key={name} className={classes.links} to="/">
                <ListItem onClick={() => dispatch(selectGenreOrCategory(id))} button>
                  <ListItemIcon>
                    <img src={genreIcons[name.toLowerCase()]} className={classes.genreImage} height={30} />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
              </Link>
            )))
        }
      </List>
    </>
  )
}

export default Sidebar
