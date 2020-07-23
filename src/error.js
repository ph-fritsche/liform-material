import { liformizeName } from 'liform-react-final'

export const getFieldError = (liform, finalName, meta) => {
    const liformName = liformizeName(finalName)
    return (
        (meta.touched || meta.dirty) && liform.validationErrors && liform.validationErrors[liformName]
            && liform.validationErrors[liformName].join('\n')
        || meta.pristine && liform.meta.errors && liform.meta.errors[liformName]
            && liform.meta.errors[liformName].join('\n')
    )
}
