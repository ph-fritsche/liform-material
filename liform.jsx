import React from 'react'
import ReactDOM from 'react-dom'
import Liform from 'liform-react-final'

import props from './props.json'
import MaterialTheme from './src'

Liform.theme = MaterialTheme

// ReactDOM.render(
//   <Liform {...props} name='form'>
//     <footer>{(renderProps) =>
//       <pre>
//         <code>
//           {JSON.stringify(renderProps.values, null, 2)}
//         </code>
//       </pre>
//     }</footer>
//   </Liform>,
//   document.getElementById('liform')
// )

import { DateTimePicker } from './src/Component/DateTime/DateTimePicker'
import DateFnsUtil from '@date-io/date-fns'

const dateUtil = new DateFnsUtil()

const valueObject = {
  input: [
      {value: '1', placeholder: 'w', label: 'Week'},
  ],
  parsed: new Date(2000, 0, 12),
  display: '',
}

ReactDOM.render(
  <DateTimePicker dateUtil={dateUtil} onChange={() => {}} valueObject={valueObject}/>,
  document.getElementById('liform')
)
