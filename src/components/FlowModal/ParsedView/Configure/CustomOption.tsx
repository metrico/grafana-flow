import { cx } from '@emotion/css'
import { getSelectStyles, useTheme2 } from '@grafana/ui'
import React, { useMemo } from 'react'
export const CustomOption = ({ isFocused, isSelected, isDisabled, innerProps, ...props }: any) => {
    console.log(props, innerProps)
    const theme = useTheme2()
    const styles = getSelectStyles(theme)
    const id = innerProps?.id
    const isInGroup = useMemo(() => id.split('-').length === 6, [id])
    return (
        <div {...innerProps} style={{ paddingLeft: isInGroup ? 30 : null }} className={cx(
            styles.option,
            isFocused && styles.optionFocused,
            isSelected && styles.optionSelected,
            isDisabled && styles.optionDisabled
        )
        }>
            {props.data.label}
        </div >

    )
}
