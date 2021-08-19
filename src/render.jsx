import React from 'react'
import PropTypes from 'prop-types'

export const Container = (props) => (
    <form
        onSubmit={props.handleSubmit}
        onReset={props.handleReset}
        method={props.method || props.liform.schema && props.liform.schema.method || 'POST'}
        action={props.action || props.liform.schema && props.liform.schema.action || ''}
        noValidate
    >
        { props.children }
    </form>
)

Container.propTypes = {
    handleSubmit: PropTypes.func,
    handleReset: PropTypes.func,
    method: PropTypes.string,
    action: PropTypes.string,
    liform: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.oneOf([null]),
    ]),
}
