import { useState } from 'react'
import { DatePicker } from 'antd'
import FormLabel from './FormLabel'
import type { RangePickerProps } from 'antd/es/date-picker'

const { RangePicker } = DatePicker

interface FormRangePickerProps {
	label?: string
	required?: boolean
}
export default function FormRangePicker(props: FormRangePickerProps & RangePickerProps) {
	const { label, required, ...rest } = props

	const [focus, setFocus] = useState(false)

	return (
		<div className="relative">
			{label && (
				<FormLabel
					focus={focus}
					required={required}
				>
					{label}
				</FormLabel>
			)}

			<RangePicker
				className="w-full"
				{...rest}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
			/>
		</div>
	)
}
