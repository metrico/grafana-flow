import React, { useEffect, useState } from 'react';
import { MultiValueGenericProps } from 'react-select';

export const MultiValueLabel = ({ data: { label }, innerProps }: MultiValueGenericProps<any>) => {
    const [labelState, setLabel] = useState(label)
    useEffect(() => {
        setLabel(label.replace('Full `', '').replace('` object', ''))
    }, [label])
    return (
        <div {...innerProps}>{labelState}</div>
    );
};

