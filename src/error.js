import { liformizeName } from 'liform-react-final/dist/field'

export const getFieldError = (liform, finalName, meta) => {
    const liformName = liformizeName(finalName)
    return (
        (meta.touched || meta.dirty) && meta.error
            && meta.error.join('\n')
        || meta.pristine && liform.meta.errors && liform.meta.errors[liformName]
            && liform.meta.errors[liformName].join('\n')
    )
}
