import React from 'react'
import ReactDOM from 'react-dom'
import Liform from 'liform-react-final'

import props from './props.json'
import MaterialTheme from './src'

Liform.defaultTheme = MaterialTheme

ReactDOM.render(
  <Liform {...props} name='form'/>,
  document.getElementById('liform')
)
