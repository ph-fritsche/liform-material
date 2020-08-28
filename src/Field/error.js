export const getFieldError = (liform, liformName, meta) => {
    return (
        (meta.touched || meta.dirty) && liform.validationErrors && liform.validationErrors[liformName]
            && liform.validationErrors[liformName].join('\n')
        || meta.pristine && liform.meta.errors && liform.meta.errors[liformName]
            && liform.meta.errors[liformName].join('\n')
    )
}
