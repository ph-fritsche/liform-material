import React from 'react'
import ReactDOM from 'react-dom'
import Liform from 'liform-react-final'

import props from './props.json'
import MaterialTheme from './src'

Liform.defaultTheme = MaterialTheme

ReactDOM.render(
  <Liform {...props} name='form'>
    <footer>{(renderProps) =>
      <pre>
        <code>
          {JSON.stringify(renderProps.values, null, 2)}
        </code>
      </pre>
    }</footer>
  </Liform>,
  document.getElementById('liform')
)
