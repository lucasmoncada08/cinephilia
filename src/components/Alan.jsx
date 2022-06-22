import alanBtn from '@alan-ai/alan-sdk-web'
import React, { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectGenreOrCategory, searchMovie } from '../features/currentGenreOrCategory'

import { fetchToken } from '../utils/index'
import { ColorModeContext } from '../utils/ToggleColorMode'

const useAlan = () => {
  const { setMode } = useContext(ColorModeContext)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    alanBtn({
      key: process.env.REACT_APP_ALAN_KEY,
      onCommand: (commands) => {
        if (commands.command === 'changeMode') {
          if (commands.mode === 'light') {
            setMode('light')
          } else {
            setMode('dark')
          }
        } else if (commands.command === 'login') {
          fetchToken()
        } else if (commands.command === 'logout') {
          localStorage.clear()
          navigate('/')
        } else if (commands.command === 'chooseGenre') {
          navigate('/')
          const foundGenre = commands.genres.find((g) => g.name.toLowerCase() === commands.genreOrCategory.toLowerCase())
          if (foundGenre) {
            dispatch(selectGenreOrCategory(foundGenre.id))
          } else if (!foundGenre) {
            const category = commands.genreOrCategory.startsWith('top') ? 'top_rated' : commands.genreOrCategory
            dispatch(selectGenreOrCategory(category))
          }
        }
      },
    })
  }, [])
}

export default useAlan
