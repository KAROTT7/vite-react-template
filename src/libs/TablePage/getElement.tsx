import dayjs, { type Dayjs } from 'dayjs'
import type {
	SelectEmuns,
	OptionItem,
	RangePickerSearch,
	RangeInputSearch,
	ElementType,
	NormalizedItem
} from './SearchForm'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormRangePicker from './FormRangePicker'
import FormDatePicker from './FormDatePicker'
import FormInputTextarea from './FormInputTextarea'
import FormRangeInput from './FormRangeInput'
import type { TableContextValue } from './context'

export function getOptions(options: SelectEmuns, isMultiple: boolean, selectAllText: string) {
	const results: OptionItem[] = []

	/** 过滤掉空数据 */
	if (Array.isArray(options)) {
		if (options.every(o => typeof o === 'string')) {
			options.forEach(o => {
				if (o) {
					results.push({
						label: o,
						value: o
					})
				}
			})
		} else {
			results.push(...options.filter(Boolean))
		}
	} else {
		Object.keys(options).forEach(key => {
			if (key) {
				results.push({
					label: options[key]!,
					value: key
				})
			}
		})
	}

	if (!isMultiple) {
		results.unshift({
			label: selectAllText,
			value: ''
		})
	}

	return results
}

function getPostArgs(item: RangePickerSearch | RangeInputSearch, name: string) {
	if (!item.postArgs) {
		item.postArgs = [`${name}Start`, `${name}End`]
	}

	return item.postArgs
}

function convertDateToString(date: Dayjs, position: 'start' | 'end', utc?: boolean) {
	const s = date.format(`YYYY-MM-DD ${position === 'start' ? '00:00:00' : '23:59:59'}`)

	return utc ? dayjs(s).utc().format('YYYY-MM-DD HH:mm:ss') : s
}

interface QueryKeyByFormKey {
	[key: string]: {
		index: number
		type: ElementType
		key: string
	}
}

interface RangePickerFormToQuery {
	type: 'rangePicker'
	handler(dates: [Dayjs, Dayjs]): { [key: string]: string }
}

interface SelectFormToQuery {
	type: 'select'
	handler(s: string[]): string
}

interface DatePickerFormToQuery {
	type: 'datePicker'
	handler(date: Dayjs): string
}

interface RangeInputFormToQuery {
	type: 'rangeInput'
	handler(values: [string, string]): { [key: string]: string }
}

export interface FormToQueryObject {
	[key: string]:
		| RangePickerFormToQuery
		| SelectFormToQuery
		| DatePickerFormToQuery
		| RangeInputFormToQuery
}

interface RangePickerQueryToForm {
	type: 'rangePicker'
	handler(start: number | string, end: number | string): [Dayjs, Dayjs]
}

interface SelectQueryToForm {
	type: 'select'
	handler(s?: string): string[] | undefined
}

interface DatePickerQueryToForm {
	type: 'datePicker'
	handler(date: string | number): Dayjs
}

interface RangeInputQueryToForm {
	type: 'rangeInput'
	handler(start: string, end: string): [string, string]
}

export interface QueryToFormObject {
	[key: string]:
		| RangePickerQueryToForm
		| SelectQueryToForm
		| DatePickerQueryToForm
		| RangeInputQueryToForm
}

export function normalizeElements(items: NormalizedItem[], formConfig: TableContextValue) {
	const queryToFormObject: QueryToFormObject = {}
	const formToQueryObject: FormToQueryObject = {}
	const queryKeyByFormKey: QueryKeyByFormKey = {}
	const normalizedItems: NormalizedItem[] = []
	const defaultValues: Record<string, any> = {}
	const { utc } = formConfig

	items.forEach(item => {
		const { type, name } = item

		defaultValues[name] = undefined

		if (type === 'rangePicker') {
			const postArgs = getPostArgs(item, name!)

			postArgs.forEach((arg, index) => {
				queryKeyByFormKey[arg] = {
					type,
					key: name!,
					index
				}
			})

			queryToFormObject[name!] = {
				type,
				handler: (start, end) => {
					const offset = utc ? dayjs().utcOffset() : 0
					return [dayjs(start).add(offset, 'm'), dayjs(end).add(offset, 'm')]
				}
			}

			formToQueryObject[name!] = {
				type,
				handler(dates) {
					return {
						[postArgs[0]]: convertDateToString(dates[0], 'start', utc),
						[postArgs[1]]: convertDateToString(dates[1], 'end', utc)
					}
				}
			}
		} else if (type === 'select') {
			const isMultiple = item.elementProps?.mode === 'multiple'

			if (isMultiple) {
				queryToFormObject[name!] = {
					type,
					handler: s => (s ? s.split(',') : undefined)
				}
				formToQueryObject[name!] = {
					type,
					handler: s => s.join(',')
				}
			} else {
				defaultValues[item.name!] = ''
			}
		} else if (type === 'datePicker') {
			queryToFormObject[name!] = {
				type,
				handler: date => dayjs(date)
			}
			formToQueryObject[name!] = {
				type,
				handler: date => date.format('YYYY-MM-DD')
			}
		} else if (type === 'rangeInput') {
			const postArgs = getPostArgs(item, name!)

			postArgs.forEach((arg, index) => {
				queryKeyByFormKey[arg] = {
					type,
					key: name!,
					index
				}
			})

			queryToFormObject[name!] = {
				type,
				handler: (start, end) => [start, end]
			}

			formToQueryObject[name!] = {
				type,
				handler: values => {
					return {
						[postArgs[0]]: values[0],
						[postArgs[1]]: values[1]
					}
				}
			}
		}

		normalizedItems.push({ ...item } as NormalizedItem)
	})

	return {
		normalizedItems,
		queryToFormObject,
		formToQueryObject,
		queryKeyByFormKey,
		defaultValues
	}
}

export interface SearchWithElement {
	type: ElementType
	name: string
	label: string
	element: React.ReactNode
	order: number
}

export function getElement(
	item: NormalizedItem,
	values: Record<string, any>,
	globalConfig: TableContextValue
): SearchWithElement | null {
	let visible = item.visible
	if (typeof visible === 'function') {
		visible = visible(values)
	}

	if (visible === false) {
		return null
	}

	const { type, name, order, elementProps = {} } = item
	const label = globalConfig.labelPlacement === 'absolute' ? item.label : undefined

	let element: React.ReactNode
	if (type === 'rangePicker') {
		element = (
			<FormRangePicker
				allowClear
				placeholder={globalConfig.rangePickerPlaceholder}
				{...elementProps}
				label={label}
			/>
		)
	} else if (type === 'select') {
		const isMultiple = elementProps?.mode === 'multiple'
		const enums = typeof item.enums === 'function' ? item.enums(values) : item.enums
		const options = getOptions(enums, isMultiple, globalConfig.selectAllText!)

		element = (
			<FormSelect
				allowClear
				{...elementProps}
				label={label}
				placeholder={isMultiple ? globalConfig.selectAllText : elementProps?.placeholder}
				options={options}
			/>
		)
	} else if (type === 'datePicker') {
		element = (
			<FormDatePicker
				allowClear
				placeholder="Select Date"
				{...elementProps}
				label={label}
			/>
		)
	} else if (type === 'textarea') {
		element = (
			<FormInputTextarea
				allowClear
				{...elementProps}
				label={label}
			/>
		)
	} else if (type === 'input') {
		element = (
			<FormInput
				allowClear
				{...elementProps}
				label={label}
			/>
		)
	} else if (type === 'rangeInput') {
		element = <FormRangeInput label={label!} />
	} else if (type === 'custom') {
		element = item.element
	}

	return {
		type,
		name,
		element,
		order,
		label: item.label
	} as SearchWithElement
}

export function copyFromSearchParams(searchParams: URLSearchParams, excludes: string[] = []) {
	const result: Record<string, string | string[]> = {}

	for (const [key, value] of searchParams) {
		if (!excludes.includes(key)) {
			if (!result[key]) {
				result[key] = value
			} else {
				if (!Array.isArray(result[key])) {
					result[key] = [result[key]]
				}

				result[key].push(value)
			}
		}
	}

	return result
}
