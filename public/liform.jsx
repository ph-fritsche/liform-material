import React from 'react'
import ReactDOM from 'react-dom'
import Liform from 'liform-react-final'

import props from './props.json'
import MaterialTheme from '../src'
import { createTheme, ThemeProvider } from '@material-ui/core'
import { LocalizationProvider } from '@material-ui/lab'
import Adapter from '@material-ui/lab/AdapterDateFns'

Liform.theme = MaterialTheme

ReactDOM.render(
  <ThemeProvider theme={createTheme()}>
    <LocalizationProvider dateAdapter={Adapter}>
      <Liform {...props} name='form'>
        <footer>{(renderProps) =>
          <pre>
            <code>
              {JSON.stringify(renderProps.values, null, 2)}
            </code>
          </pre>
        }</footer>
      </Liform>
    </LocalizationProvider>
  </ThemeProvider>,
  document.getElementById('liform')
)
