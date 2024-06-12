import { useState } from 'react'
import { Input } from 'antd'
import FormLabel from './FormLabel'
import type { TextAreaProps } from 'antd/es/input'

interface FormInputTextareaProps extends TextAreaProps {
	label: string
	required?: boolean
}
export default function FormInputTextarea(props: FormInputTextareaProps) {
	const {
 label, required, ...rest 
} = props

	const [focus, setFocus] = useState(false)

	return (
		<div className="relative">
			<FormLabel focus={focus} required={required}>
				{label}
			</FormLabel>
			<Input.TextArea {...rest} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
		</div>
	)
}
