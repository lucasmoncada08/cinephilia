import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Typography, Button, Box } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'

import { useGetListQuery } from '../../services/TMDB'

import { userSelector } from '../../features/auth'
import { RatedCards } from '../index'

const Profile = () => {
  const { user } = useSelector(userSelector)

  const { data: favouriteMovies, refetch: refetchFavourites } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 })
  const { data: watchlistMovies, refetch: refetchWatchlist } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 })

  useEffect(() => {
    refetchFavourites()
    refetchWatchlist()
  }, [])

  const logout = () => {
    localStorage.clear()

    window.location.href = '/'
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>
      {!favouriteMovies?.results?.length && !watchlistMovies?.results?.length
        ? <Typography>Add favourites or watchlist movies to view them here</Typography>
        : (
          <Box>
            <RatedCards title="Favourite Movies" data={favouriteMovies} />
            <RatedCards title="WatchList Movies" data={watchlistMovies} />
          </Box>
        )}
    </Box>
  )
}
export default Profile
