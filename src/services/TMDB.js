import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY
const baseApiUrl = 'https://api.themoviedb.org/3'

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseApiUrl }),
  endpoints: (builder) => ({
    // Get Movies by [Type]
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page, searchQuery }) => {
        // get movies by search
        if (searchQuery) {
          return `search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`
        }

        // get movies by category
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'string') {
          return `movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbApiKey}`
        }

        // get movies by genre
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === 'number') {
          return `discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${tmdbApiKey}`
        }

        return `movie/popular?page=${page}&api_key=${tmdbApiKey}`
      },
    }),

    // Get Movie by ID
    getMovie: builder.query({
      query: (id) => `movie/${id}?append_to_response=videos,credits&api_key=${tmdbApiKey}`,
    }),

    // Get List
    getList: builder.query({
      query: ({ listName, accountId, sessionId, page }) => `/account/${accountId}/${listName}?api_key=${tmdbApiKey}&session_id=${sessionId}&page=${page}`,
    }),

    // Get Person by ID
    getPerson: builder.query({
      query: (id) => `person/${id}?append_to_response=movie_credits&api_key=${tmdbApiKey}`,
    }),

    // Get Genres
    getGenres: builder.query({
      query: () => `genre/movie/list?api_key=${tmdbApiKey}`,
    }),

    // Get User Specific Lists
    getRecommendations: builder.query({
      query: ({ movieId, list }) => `movie/${movieId}/${list}?api_key=${tmdbApiKey}`,
    }),
  }),
})

export const {
  useGetGenresQuery,
  useGetMoviesQuery,
  useGetMovieQuery,
  useGetRecommendationsQuery,
  useGetPersonQuery,
  useGetListQuery,
} = tmdbApi
