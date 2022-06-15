import React, { useEffect } from 'react'
import { Divider, List, ListItem, ListItemText, ListItemIcon, Box, CircularProgress, ListSubheader } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/styles'
import lightLogo from '../images/Light-Window-Watching-Logo.png'
import darkLogo from '../images/Dark-Window-Watching-Logo.png'

import useStyles from './styles'

const categories = [
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Upcoming', value: 'upcoming' },
]

const demoCategories = [
  { label: 'Comedy', value: 'comedy' },
  { label: 'Action', value: 'action' },
  { label: 'Horror', value: 'horror' },
  { label: 'Animation', value: 'animation' },
]

const Sidebar = ({ setMobileOpen }) => {
  const theme = useTheme()
  const classes = useStyles()

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
            <ListItem onClick={() => {}} button>
              {/* <ListItemIcon>
                <img src={darkLogo} clasName={classes.genreImages} height={30} />
              </ListItemIcon> */}
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <ListSubheader>Genres</ListSubheader>
        {demoCategories.map(({ label, value }) => (
          <Link key={value} className={classes.links} to="/">
            <ListItem onClick={() => {}} button>
              {/* <ListItemIcon>
                <img src={darkLogo} clasName={classes.genreImages} height={30} />
              </ListItemIcon> */}
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
      </List>
    </>
  )
}

export default Sidebar
