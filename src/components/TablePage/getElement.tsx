import { Select } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import type { TableColumn } from '.'
import type {
	BasicFormElementWithElement,
	ConvertInFunction,
	ConvertOutFunction
} from './SearchForm'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormRangePicker from './FormRangePicker'
import FormDatePicker from './FormDatePicker'
import FormInputTextarea from './FormInputTextarea'
import FormRangeInput from './FormRangeInput'

const { Option } = Select

export default function getElement(
	column: TableColumn<any>,
	index: number
): BasicFormElementWithElement {
	const formItemProps = column.search!

	const { type, name, label, order = index } = formItemProps

	let convertIn: ConvertInFunction, convertOut: ConvertOutFunction

	const formItemLabel = label || (column.title as string)

	let element: React.ReactNode, defaultValue: string
	if (type === 'rangePicker') {
		convertIn = (start: string | number, end: string | number) => {
			return [dayjs(start), dayjs(end)]
		}

		convertOut = function (dates: [Dayjs, Dayjs]) {
			return {
				[`${column.dataIndex}Start`]: dates[0].format('YYYY-MM-DD 00:00:00'),
				[`${column.dataIndex}End`]: dates[1].format('YYYY-MM-DD 23:59:59')
			}
		}

		element = (
			<FormRangePicker
				label={formItemLabel}
				{...formItemProps.elementProps}
				allowClear
				placeholder={['Start Date', 'End Date']}
			/>
		)
	} else if (type === 'select') {
		const options = formItemProps.enums != null ? formItemProps.enums : []
		const elementProps = formItemProps.elementProps
		const isMultiple = elementProps?.mode === 'multiple'

		if (isMultiple) {
			convertIn = (s?: string) => (s ? s.split(',') : undefined)
			convertOut = (s: string[]) => s.join(',')
		} else {
			defaultValue = ''
		}

		let node: React.ReactNode
		if (Array.isArray(options)) {
			node = options.map((item, index) => {
				if (item == null) {
					return null
				}

				const isString = typeof item === 'string'
				const label = isString ? item : item.label
				const value = isString ? item : item.value

				return (
					<Option key={String(value) + index} value={String(value)}>
						{label}
					</Option>
				)
			})
		} else {
			node = Object.keys(options).map((key) => (
				<Option key={String(key)} value={key}>
					{options[key]}
				</Option>
			))
		}

		element = (
			<FormSelect
				allowClear
				label={formItemLabel}
				{...elementProps}
				placeholder={isMultiple ? 'All' : elementProps?.placeholder}
			>
				{isMultiple ? null : <Option value="">All</Option>}
				{node}
			</FormSelect>
		)
	} else if (type === 'datePicker') {
		convertIn = (date: string | number) => dayjs(date)
		convertOut = (date: Dayjs) => date.format('YYYY-MM-DD HH:mm:ss')
		element = (
			<FormDatePicker
				label={formItemLabel}
				{...formItemProps.elementProps}
				allowClear
				placeholder="Select Date"
			/>
		)
	} else if (type === 'textarea') {
		element = <FormInputTextarea label={formItemLabel} allowClear {...formItemProps.elementProps} />
	} else if (type === 'input') {
		element = <FormInput label={formItemLabel} allowClear {...formItemProps.elementProps} />
	} else if (type === 'rangeInput') {
		element = <FormRangeInput label={formItemLabel} />
	} else {
		element = formItemProps.element
	}

	return {
		type,
		name: name || column.dataIndex,
		element,
		order,
		convertIn,
		convertOut,
		defaultValue
	} as BasicFormElementWithElement
}
