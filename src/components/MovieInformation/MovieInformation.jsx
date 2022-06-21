import React, { useState, useEffect } from 'react'
import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, useMediaQuery, Rating } from '@mui/material'
import { Language, Theaters, Movie as MovieIcon, Slideshow, FavoriteBorder, Favorite, Add, Remove, ArrowBack } from '@mui/icons-material'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { MovieList } from '../index'
import { useGetMovieQuery, useGetRecommendationsQuery, useGetListQuery } from '../../services/TMDB'
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory'
import { userSelector } from '../../features/auth'
import stockImage from '../../assets/images/stock_crew_image.png'

import genreIcons from '../../assets/genres'
import useStyles from './styles'

const MovieInformation = () => {
  const { user } = useSelector(userSelector)
  const { id } = useParams()

  const { data, isFetching, error } = useGetMovieQuery(id)
  const { data: recommendations, isRecoFetching } = useGetRecommendationsQuery({ list: 'recommendations', movieId: id })
  const { data: favouriteMovies } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 })
  const { data: watchlistMovies } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 })

  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [isMovieFavourited, setIsMovieFavorited] = useState(false)
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false)

  const getCastDict = { Production: 1, Sound: 1, Directing: 2, Writing: 2 }
  const crewGotten = {}

  // console.log(data)
  // console.log(recommendations)

  const classes = useStyles()

  useEffect(() => {
    setIsMovieFavorited(!!favouriteMovies?.results?.find((movie) => movie?.id === data?.id))
  }, [favouriteMovies, data])

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id))
  }, [watchlistMovies, data])

  const imdb_key = process.env.REACT_APP_TMDB_KEY
  const addToFavourites = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${imdb_key}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      favorite: !isMovieFavourited,
    })
    setIsMovieFavorited((prev) => !prev)
  }

  const addToWatchList = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${imdb_key}&session_id=${localStorage.getItem('session_id')}`, {
      media_type: 'movie',
      media_id: id,
      watchlist: !isMovieWatchlisted,
    })
    setIsMovieWatchlisted((prev) => !prev)
  }

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
      <Grid item sm={12} lg={4}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data?.release_date.split('-')[0]})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={data?.vote_average / 2} precision={0.1} />
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: '10px' }}>
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime}mins | {data?.spoken_languages.length > 0 ? data?.spoken_languages[0].english_name : ''}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link key={genre.name} className={classes.links} to="/" onClick={() => dispatch(selectGenreOrCategory(genre.id))}>
              <img src={genreIcons[genre.name.toLowerCase()]} className={classes.genreImage} height={30} />
              <Typography color="textPrimary" variant="subtitle1">
                {genre.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>Overview</Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
        <Typography variant="h5" gutterBottom>Top Cast</Typography>
        <Grid item container spacing={2}>
          {data && data.credits?.cast?.map((character, i) => (
            character.profile_path && (
              <Grid key={i} item xs={4} md={2} component={Link} to={`/actors/${character.id}`} style={{ textDecoration: 'none' }}>
                <img className={classes.castImage} src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`} alt={character.name} />
                <Typography color="textPrimary">{character?.name}</Typography>
                <Typography color="textSecondary">
                  {character.character.split('/')[0]}
                </Typography>
              </Grid>
            )
          )).slice(0, 6)}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>Top Crew</Typography>
        <Grid item container spacing={2}>
          {data && data.credits?.crew?.slice(0, 50).map((character, i) => {
            if (getCastDict[character.department] > 0 && !crewGotten[character.name + character.department]) {
              getCastDict[character.department] -= 1
              crewGotten[character.name + character.department] = true
              return (
                <Grid key={i} item xs={4} md={2} style={{ textDecoration: 'none' }}>
                  <img className={classes.castImage} src={character.profile_path ? `https://image.tmdb.org/t/p/w500/${character.profile_path}` : stockImage} alt={character.name} />
                  <Typography color="textPrimary">{character?.name}</Typography>
                  <Typography color="textSecondary">
                    {character.department}
                  </Typography>
                </Grid>
              )
            }
          })}
        </Grid>
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button target="_blank" rel="noopener noreferrer" href={data?.homepage} endIcon={<Language />}>Wesbite</Button>
                <Button target="_blank" rel="noopener noreferrer" href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<Theaters />}>IMDB</Button>
                <Button target="_blank" rel="noopener noreferrer" href={`https://www.rottentomatoes.com/m/${data.original_title.toLowerCase().split(' ').join('_')}`} endIcon={<MovieIcon />}>RT</Button>
                <Button onClick={() => setOpen(true)} href="#" endIcon={<Slideshow />}>Trailer</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button onClick={addToFavourites} endIcon={isMovieFavourited ? <Favorite /> : <FavoriteBorder />}>
                  {isMovieFavourited ? 'Unfavourite' : 'Favourite'}
                </Button>
                <Button onClick={addToWatchList} endIcon={isMovieWatchlisted ? <Remove /> : <Add />}>
                  Watchlist
                </Button>
                <Button endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
                  <Typography component={Link} to="/" color="inherit" variant="subtitle2" style={{ textDecoration: 'none' }}>
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">
          You might also like
        </Typography>
        {recommendations?.results
          ? <MovieList movies={recommendations.results} numberOfMovies={12} />
          : <Box>Sorry, nothing was found here.</Box>}
      </Box>
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {data?.videos?.results?.length > 0 && (
          <iframe
            autoPlay
            className={classes.videos}
            frameBorder="0"
            title="Trailer"
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow="autoplay"
          />
        )}
      </Modal>
    </Grid>
  )
}

export default MovieInformation
