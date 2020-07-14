[![codecov](https://codecov.io/gh/ph-fritsche/liform-material/branch/master/graph/badge.svg)](https://codecov.io/gh/ph-fritsche/liform-material)

# ![Liform Material](https://ph-fritsche.github.io/liform-material/assets/liform-material.png)

Theme for [Liform React Final](https://ph-fritsche.github.io/liform-react-final/).

Turn your [Symfony Forms](https://symfony.com/doc/current/components/form.html) into [Material](https://material.io/) themed [React](https://reactjs.org/) components.

## Installation

Install via yarn from [npmjs.com](https://www.npmjs.com/package/liform-material)
```
yarn add liform-material
```

## Usage

```jsx
import { Liform } from 'liform-react-final'
import MaterialTheme from 'liform-material'

const myFormComponent = (
  <Liform
    // liformProps as provided by Pitch/Liform
    {...liformProps
    // add the material theme
    theme={MaterialTheme}
  />
 )
 ```
