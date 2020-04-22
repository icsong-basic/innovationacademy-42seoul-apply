import React, { useEffect, useRef, useState } from 'react'
import { InputLabel, Select as Select_, FormControl } from '@material-ui/core'

interface Props {
    variant?: 'standard' | 'outlined' | 'filled';
    margin?: 'none' | 'dense' | 'normal',
    label?: string,
    fullWidth?: boolean;
    value?: unknown;
    onChange?: (
        event: React.ChangeEvent<{ name?: string; value: unknown }>,
        child: React.ReactNode,
    ) => void,
    children: any
}

export default function Select({ fullWidth, variant, margin, label, value, onChange, children }: Props) {
    const inputLabel = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    useEffect(() => {
        if (inputLabel && inputLabel.current != null) {
            setLabelWidth((inputLabel.current as any).offsetWidth);
        }
    }, []);

    return (
        <FormControl margin={margin} fullWidth={fullWidth} variant={variant}>
            <InputLabel ref={inputLabel}>{label}</InputLabel>
            <Select_
                labelWidth={labelWidth}
                value={value}
                onChange={onChange}
            >
                {children}
            </Select_>
        </FormControl>
    )
}
