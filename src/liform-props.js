import PropTypes from 'prop-types'

export const FormRenderProps = {
    liform: PropTypes.object.isRequired,
}

export const FieldRenderProps = {
    schema: PropTypes.any,
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
}
