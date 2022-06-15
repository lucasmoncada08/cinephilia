import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY
// https://api.themoviedb.org/3/movie/popular?api_key=<<api_key>>&language=en-US&page=1
const baseApiUrl = 'https://api.themoviedb.org/3'
const page = 1

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseApiUrl }),
  endpoints: (builder) => ({
    // Get Movies by [Type]
    getMovies: builder.query({
      query: () => `movie/popular?page=${page}&api_key=${tmdbApiKey}`,
    }),
  }),
})

export const {
  useGetMoviesQuery,
} = tmdbApi
