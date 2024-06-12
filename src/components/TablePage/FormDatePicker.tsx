import { useState } from 'react'
import { DatePicker } from 'antd'
import FormLabel from './FormLabel'
import type { DatePickerProps } from 'antd/es/date-picker'

interface FormDatePickerProps {
	label?: string
	required?: boolean
}
export default function FormDatePicker(props: FormDatePickerProps & DatePickerProps) {
	const {
 label, required, ...rest 
} = props

	const [focus, setFocus] = useState(false)

	return (
		<div className="relative">
			<FormLabel focus={focus} required={required}>
				{label}
			</FormLabel>
			<DatePicker
				className="w-full"
				{...rest}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
			/>
		</div>
	)
}
