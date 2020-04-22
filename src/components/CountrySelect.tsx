import React from 'react'
import countries from '../countries';
import Select from './Select';
import { MenuItem } from '@material-ui/core';

interface Props {
    variant?: 'standard' | 'outlined' | 'filled';
    margin?: 'none' | 'dense' | 'normal',
    label?: string,
    fullWidth?: boolean;
    value?: unknown;
    onChange?: (
        event: React.ChangeEvent<{ name?: string; value: unknown }>,
        child: React.ReactNode,
    ) => void
}

const countriesData = Object.keys(countries.ko).map((countryCode, key) => {
    return { countryCode, name: countries.ko[countryCode] }
})
countriesData.sort((i1, i2) => i1.name.localeCompare(i2.name));

export default function CountrySelect({ variant, margin, label, fullWidth, value, onChange }: Props) {
    return (
        <Select value={value} onChange={onChange} variant={variant} margin={margin} label={label} fullWidth={fullWidth}>
            {
                countriesData.map(({ countryCode, name }, key) => {
                    return <MenuItem value={countryCode} key={key}>{name}</MenuItem>
                })
            }
        </Select>
    )
}
