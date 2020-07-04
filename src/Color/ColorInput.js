import React from 'react'
import clsx from 'clsx'
import { makeStyles, fade } from '@material-ui/core'

const useStyle = makeStyles(theme => ({
    color: {
        minHeight: '1.1876em',
        minWidth: '10em',
        width: '100%',
    },
    noColor: {
        backgroundImage: "\
            linear-gradient(to right, hsla(0, 0%, 80%, 0.75) 50%, hsla(0, 0%, 80%, 0.75) 50%),\
            linear-gradient(to right, black 50%, white 50%),\
            linear-gradient(to bottom, black 50%, white 50%);",
        backgroundBlendMode: 'normal, difference, normal',
        backgroundSize: '1.1876em 1.1876em',
        opacity: .5,
    },
}))

export const ColorInput = React.forwardRef(function ColorInput(props, ref) {
    const {
        className,
        name,
        value,

        ...others
    } = props

    const style = useStyle(props)

    return (<>
        <div
            className={className}
        >
            <div
                className={clsx(
                    style.color,
                    !value && style.noColor,
                )}
               style={{backgroundColor: value }}
            >
            </div>        
        </div>
        <input
            ref={ref}
            type='color'
            name={name}
            value={value}
            onClick={event => { event.preventDefault() }}
            style={{minWidth: '5em', display: 'none'}}
        />
    </>)
})
