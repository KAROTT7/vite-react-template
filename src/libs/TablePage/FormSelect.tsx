import { useState } from 'react'
import { Select } from 'antd'
import FormLabel from './FormLabel'
import type { SelectProps } from 'antd/es/select'

interface FormSelectProps extends SelectProps {
	label?: string
	required?: boolean
}
export default function FormSelect(props: FormSelectProps) {
	const { label, required, ...rest } = props
	const [focus, setFocus] = useState(false)

	return (
		<div className="relative">
			{label && (
				<FormLabel focus={focus} required={required}>
					{label}
				</FormLabel>
			)}
			<Select {...rest} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
		</div>
	)
}
