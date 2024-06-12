import { useEffect, useState } from 'react'
import { Input, Space } from 'antd'
import classNames from 'classnames'
import { float4Reg } from '@/utils/reg'

type InputType = string | number | undefined
export interface RangeInputValues {
	min: InputType
	max: InputType
}
export interface RangeInputProps {
	value?: RangeInputValues
	onChange?: (v: RangeInputValues) => void
	onFocus?: () => void
	onBlur?: () => void
}
export default function RangeInput(props: RangeInputProps) {
	const {
 value, onChange, onFocus, onBlur 
} = props
	const [min, setMin] = useState<InputType>(undefined)
	const [max, setMax] = useState<InputType>(undefined)

	useEffect(() => {
		if (value) {
			if (value.min !== min) {
				setMin(value.min)
			}
			if (value.max !== max) {
				setMax(value.max)
			}
		} else {
			setMin(undefined)
			setMax(undefined)
		}
	}, [value])

	const triggerChange = (params: RangeInputValues): void => {
		if (onChange) {
			onChange({
				min: params.min && float4Reg.test(String(params.min)) ? params.min : undefined,
				max: params.max && float4Reg.test(String(params.max)) ? params.max : undefined
			})
		}
	}

	const onMinChange = (e) => {
		let v = e.target.value
		if (float4Reg.test(v) || v == '') {
			if (v == '') {
				v = null
			}

			setMin(v)
			triggerChange({
				min: v,
				max
			})
		} else {
			e.target.value = min
		}
	}

	const onMaxChange = (e) => {
		let v = e.target.value
		if (float4Reg.test(v) || v == '') {
			if (v == '') {
				v = null
			}

			setMax(v)
			triggerChange({
				min,
				max: v
			})
		} else {
			e.target.value = max
		}
	}

	const inputClass = 'text-center'

	return (
		<Space.Compact>
			<Input
				className={inputClass}
				placeholder="Minimum"
				value={min}
				onChange={onMinChange}
				onFocus={() => onFocus?.()}
				onBlur={() => onBlur?.()}
			/>
			<Input className="!bg-white w-12 border-l-0 pointer-events-none" placeholder="~" disabled />
			<Input
				className={classNames(inputClass, 'border-l-transparent')}
				placeholder="Maximum"
				value={max}
				onChange={onMaxChange}
				onFocus={() => onFocus?.()}
				onBlur={() => onBlur?.()}
			/>
		</Space.Compact>
	)
}
