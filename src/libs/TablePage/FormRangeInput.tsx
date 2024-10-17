import { useEffect, useState } from 'react'
import FormLabel from './FormLabel'
import { Input, Space } from 'antd'
import classNames from 'classnames'

interface FormRangeInputProps extends RangeInputProps {
	label?: string
	required?: boolean
}
export default function FormRangeInput(props: FormRangeInputProps) {
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
			<RangeInput
				{...rest}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
			/>
		</div>
	)
}

type InputType = string | number | undefined
type RangeInputValues = [InputType, InputType]
interface RangeInputProps {
	value?: RangeInputValues
	onChange?: (v: RangeInputValues) => void
	onFocus?: () => void
	onBlur?: () => void
}
function RangeInput(props: RangeInputProps) {
	const { value, onChange, onFocus, onBlur } = props

	const [values, setValues] = useState<RangeInputValues>()

	useEffect(() => {
		setValues(s => {
			if (s === value) {
				return s
			}

			if (Array.isArray(value)) {
				if (!Array.isArray(s)) {
					return value
				}

				if (s[0] !== value[0] || s[1] !== value[1]) {
					return value
				}
			}

			return s
		})
	}, [value])

	const triggerChange = (params: RangeInputValues): void => {
		if (onChange) {
			onChange(params)
		}
	}

	const onMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const next: RangeInputValues = [e.target.value, values ? values[1] : undefined]
		triggerChange(next)
	}

	const onMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const next: RangeInputValues = [values ? values[0] : undefined, e.target.value]
		triggerChange(next)
	}

	const inputClass = 'text-center'

	return (
		<Space.Compact>
			<Input
				className={inputClass}
				placeholder="Minimum"
				value={values && values[0] ? values[0] : ''}
				onChange={onMinChange}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
			<Input
				className="!bg-white w-12 border-l-0 pointer-events-none"
				placeholder="~"
				disabled
			/>
			<Input
				className={classNames(inputClass, 'border-l-transparent')}
				placeholder="Maximum"
				value={values && values[1] ? values[1] : ''}
				onChange={onMaxChange}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		</Space.Compact>
	)
}
