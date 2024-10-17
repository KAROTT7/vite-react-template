import { useState } from 'react'
import { Input } from 'antd'
import FormLabel from './FormLabel'
import type { InputProps } from 'antd/es/input'

interface FormInputProps extends InputProps {
	label?: string
	required?: boolean
}
export default function FormInput(props: FormInputProps) {
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
			<Input
				{...rest}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
			/>
		</div>
	)
}
