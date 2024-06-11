import { useState } from 'react'
import FormLabel from './FormLabel'
import RangeInput from '../RangeInput'
import type { RangeInputProps } from '../RangeInput'

interface FormRangeInputProps extends RangeInputProps {
	label: string
	required?: boolean
}
export default function FormRangeInput(props: FormRangeInputProps) {
	const { label, required, ...rest } = props

	const [focus, setFocus] = useState(false)

	return (
		<div className="relative">
			<FormLabel focus={focus} required={required}>
				{label}
			</FormLabel>
			<RangeInput {...rest} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
		</div>
	)
}
