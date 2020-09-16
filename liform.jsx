import React, { useRef } from 'react'
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

import { TextField } from '@material-ui/core'
import { Picker } from './src/Component/Picker/Picker'
import { PickerModal } from './src/Component/Picker/PickerModal'
import { useState } from 'react'

function TestComponent() {
  const anchor = useRef()
  const [render, rerender] = useState(0)

  return <>
    <button onClick={() => rerender(render + 1)}>Rerender</button>
    <div ref={anchor} style={{ border: '1px solid blue' }}>bar</div>
    <PickerModal anchorEl={anchor} open={true} PickerComponent={() => <div style={{ border: '1px solid red' }}>foo</div>} />
  </>
}

function PickerComponent() {
  return (
    <div style={{ border: '1px solid red' }}>
      foo
    </div>
  )
}

function TestComponent2() {
  return <Picker PickerComponent={PickerComponent} initialOpen={true} />
}

ReactDOM.render(
  <>
    <TestComponent2 />
    <TextField label="bar" variant="filled" />
  </>,
  document.getElementById('liform')
)
