import React from 'react'
import PropTypes from 'prop-types'
import { LiformContextProp } from 'liform-react-final/dist/form'

export const Container = (props) => (
    <form
        onSubmit={props.handleSubmit}
        onReset={props.handleReset}
        method={props.method || props.liform.schema && props.liform.schema.method || 'POST'}
        action={props.action || props.liform.schema && props.liform.schema.action || ''}
    >
        { props.children }
    </form>
)

Container.propTypes = {
    handleSubmit: PropTypes.func,
    handleReset: PropTypes.func,
    method: PropTypes.string,
    action: PropTypes.string,
    liform: LiformContextProp.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.oneOf([null])
    ]),
}
