import React, { useState, useEffect, useRef } from 'react'
import { TextField } from '@material-ui/core'
import update from 'immutability-helper'

interface Props {
    label: string
    value: string
    onChange: (newVal: string) => void
}

function getDigitGroups(text: string): string[] {
    if (!text) {
        return ['', '', '']
    }
    const result = text.split('-');
    while (result.length < 3) {
        result.push('')
    }
    for (let i = 0; i < 3; i++) {
        if (!result[i]) {
            result[i] = ''
        }
    }
    return result;
}

export default function TelephoneInput({ label, value, onChange }: Props) {
    const digitGroups = getDigitGroups(value);
    const ref1 = useRef();
    const ref2 = useRef();
    const ref3 = useRef();
    const refs = [ref1, ref2, ref3];

    useEffect(() => {
        return () => { }
    }, [value])

    const onTextFieldChange = (index: number, e: React.SyntheticEvent<any, Event>) => {
        const digits: string = (e.target as any).value
        onChange(update<string[]>(digitGroups, { [index]: { $set: digits } }).join('-'));
        if (digits.length >= (index === 0 ? 3 : 4)) {
            if (refs && refs[index + 1] && refs[index + 1].current) {
                (refs[index + 1].current as any).focus()
            }
        } else if (digits.length === 0) {
            if (refs && refs[index - 1] && refs[index - 1].current) {
                (refs[index - 1].current as any).focus()
            }
        }
    }

    return (
        <div className="tel-input">
            <TextField
                inputRef={ref1}
                type="tel"
                margin="normal"
                label={label}
                variant="outlined"
                InputLabelProps={{ shrink: value.replace(/-/ig, '').length > 0, }}
                value={digitGroups[0]}
                onChange={e => { onTextFieldChange(0, e) }}
            />
            <span>-</span>
            <TextField
                inputRef={ref2}
                type="tel"
                margin="normal"
                variant="outlined"
                value={digitGroups[1]}
                onChange={e => { onTextFieldChange(1, e) }}
            />
            <span>-</span>
            <TextField
                inputRef={ref3}
                type="tel"
                margin="normal"
                variant="outlined"
                value={digitGroups[2]}
                onChange={e => { onTextFieldChange(2, e) }}
            />
        </div>
    )
}
