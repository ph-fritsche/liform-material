import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { DateTimeField } from '../../../src'
import DateFnsUtils from '@date-io/date-fns'
import { wrapInTheme } from '../../_theme'
import { wrapInLocalization } from '../../_localization'

const dateUtil = new DateFnsUtils()

function mockDataTransfer(data) {
    return {
        getData: () => data,
    }
}

describe('DateTimeField', () => {
    it('Paste value', () => {
        const format = "yyyy-MM-dd'T'HH:mm:ssxxx"
        const onChange = jest.fn()
        const rendered = render(wrapInTheme(wrapInLocalization(<DateTimeField onChange={onChange} valueFormat={format} label="foo"/>)))

        fireEvent.paste(rendered.getByLabelText('foo'), {clipboardData: mockDataTransfer('')})

        expect(onChange).not.toBeCalled()

        fireEvent.paste(rendered.getByLabelText('foo'), {clipboardData: mockDataTransfer('foo')})

        expect(onChange).not.toBeCalled()

        fireEvent.paste(rendered.getByLabelText('foo'), {clipboardData: mockDataTransfer('2010-11-12T13:14:15+0800')})

        expect(onChange).toBeCalledWith(
            // the value will be with local timezone offset
            dateUtil.formatByString(Date.UTC(2010, 10, 12, 5, 14, 15), format),
        )
    })
})
