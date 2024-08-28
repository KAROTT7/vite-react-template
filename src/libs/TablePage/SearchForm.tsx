import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import cl from 'classnames'
import { Row, Col, Form, Button } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import type { InputProps, TextAreaProps } from 'antd/es/input'
import type { FormProps, FormInstance } from 'antd/es/form'
import type { SelectProps } from 'antd/es/select'
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'
import {
	copyFromSearchParams,
	getElement,
	normalizeElements,
	type SearchWithElement
} from './getElement'
import { useSearchParams } from 'react-router-dom'
import { useTablePageConfig } from './context'
import { type RangeInputProps } from '@/components/RangeInput'

export interface OptionItem {
	label: string
	value: string | number
}

export type SelectEmuns = Record<string, string> | OptionItem[] | string[]

interface BasicSearch {
	/** 是否展示该查询项 */
	visible?: boolean | ((values: any) => boolean)
	/**
	 * 用于 <Form.Item name={name} />
	 * @default `name` 字段默认取 `column.dataIndex`
	 */
	name?: string

	/**
	 * 用于 <Form.Item label={label} />
	 */
	label?: string

	/**
	 * 指定排列顺序
	 * @default 0
	 */
	order?: number
}

export type ElementType =
	| 'input'
	| 'select'
	| 'rangePicker'
	| 'datePicker'
	| 'textarea'
	| 'rangeInput'
	| 'custom'

interface InputSearch extends BasicSearch {
	type: 'input'
	elementProps?: InputProps
}

interface SelectSearch extends BasicSearch {
	type: 'select'
	enums: SelectEmuns | ((values: any) => SelectEmuns)
	elementProps?: Omit<SelectProps, 'options'>
}

export interface RangePickerSearch extends BasicSearch {
	type: 'rangePicker'
	elementProps?: RangePickerProps
	/** form 中的参数转换后传给 location.query 的值 */
	postArgs?: [string, string]
}

interface DatePickerSearch extends BasicSearch {
	type: 'datePicker'
	elementProps?: DatePickerProps
}

interface TextAreaSearch extends BasicSearch {
	type: 'textarea'
	elementProps?: TextAreaProps
}

export interface RangeInputSearch extends BasicSearch {
	type: 'rangeInput'
	elementProps?: RangeInputProps
	/** form 中的参数转换后传给 location.query 的值 */
	postArgs?: [string, string]
}

interface CustomElementSearch extends BasicSearch {
	type: 'custom'
	element: React.ReactNode
}

export type FormElement =
	| InputSearch
	| SelectSearch
	| RangePickerSearch
	| DatePickerSearch
	| TextAreaSearch
	| RangeInputSearch
	| CustomElementSearch

export type NormalizedItem = FormElement & {
	order: number
	name: string
	label: string
	elementProps: any
}

export interface FormConfig {
	onValuesChange?(
		changed: Record<string, any>,
		changedValues: Record<string, any>,
		form: FormInstance
	): void
}

export type AntdFormProps = Omit<
	FormProps,
	'onFinish' | 'form' | 'initialValues' | 'onValuesChange' | 'labelCol' | 'wrapperCol'
> & {
	onValuesChange?(
		changed: Record<string, any>,
		changedValues: Record<string, any>,
		form: FormInstance
	): void
}

interface SearchFormProps<T> {
	className?: string
	searchs: NormalizedItem[]
	onSearch(values?: T): void
	formProps: AntdFormProps
	collapsed: boolean
	setCollapsed(v: boolean | ((prev: boolean) => boolean)): void
}

const SearchForm = forwardRef<any, SearchFormProps<any>>((props, ref) => {
	const { className, searchs, onSearch, formProps, collapsed, setCollapsed } = props

	const { formConfig, enableFormCollapse, hiddenFormButtons, ...globalConfig } =
		useTablePageConfig()
	const [form] = Form.useForm()
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [searchParams] = useSearchParams()

	const {
		normalizedItems,
		queryKeyByFormKey,
		formToQueryObject,
		queryToFormObject,
		defaultValues
	} = useMemo(() => normalizeElements(searchs, globalConfig), [searchs, globalConfig])

	useImperativeHandle(
		ref,
		() => {
			return { formToQueryObject, formWrapper: wrapperRef.current }
		},
		[formToQueryObject]
	)

	const initialValues = getInitialValues(
		searchParams,
		queryToFormObject,
		queryKeyByFormKey,
		defaultValues
	)

	const [changedValues, setChangedValues] = useState(initialValues)

	const finalItems = useMemo(() => {
		return normalizedItems
			.map((item) => getElement(item, changedValues, globalConfig))
			.filter(Boolean) as SearchWithElement[]
	}, [normalizedItems, changedValues, globalConfig])

	function resetFields() {
		// form.resetFields() 无效，故使用以下方式重置
		// const resetValues = items.reduce((final, item) => {
		// 	final[item.name] = finalItems.defaultValue
		// 	return final
		// }, {} as Record<string, any>)

		setChangedValues(defaultValues)
		form.setFieldsValue(defaultValues)
	}

	const [span, setSpan] = useState(6)

	useEffect(() => {
		const el = wrapperRef.current
		let resizeObserver: ResizeObserver
		if (el) {
			resizeObserver = new ResizeObserver((entries) => {
				for (const entry of entries) {
					if (entry.target === el) {
						const { width } = entry.contentRect

						setSpan((prevSpan) => {
							let nextSpan = prevSpan

							if (width < 600) {
								nextSpan = 24
							} else if (width < 1000) {
								nextSpan = 12
							} else if (width < 1300) {
								nextSpan = 8
							} else if (width < 1700) {
								nextSpan = 6
							} else {
								nextSpan = 4
							}

							return nextSpan
						})
					}
				}
			})

			resizeObserver.observe(el)
		}

		return () => {
			if (resizeObserver && el) {
				resizeObserver.unobserve(el)
			}
		}
	}, [])

	if (finalItems.length === 0) {
		return null
	}

	const maxItemsPerLine = 24 / span
	let itemLength = finalItems.length
	if (collapsed && itemLength + 1 > maxItemsPerLine) {
		itemLength = maxItemsPerLine === 1 ? 1 : maxItemsPerLine - 1
	}

	return (
		<div ref={wrapperRef} className={cl('bg-white p-4 rounded mb-3 shadow-sm', className)}>
			<Form
				{...formConfig}
				{...formProps}
				form={form}
				onFinish={(values) => {
					if (globalConfig.collapsedAfterSearch) {
						setCollapsed(true)
					}

					onSearch(values)
				}}
				initialValues={initialValues}
				onValuesChange={(_, changedValues) => {
					setChangedValues(changedValues)

					formProps?.onValuesChange?.(_, changedValues, form)
					formConfig?.onValuesChange?.(_, changedValues, form)
				}}
			>
				<Row gutter={globalConfig.rowGutter}>
					{finalItems.slice(0, itemLength).map((o) => {
						return (
							<Col key={o.name} span={span}>
								<Form.Item
									name={o.name}
									className="mb-0"
									label={globalConfig.labelPlacement === 'absolute' ? undefined : o.label}
								>
									{o.element}
								</Form.Item>
							</Col>
						)
					})}
					{hiddenFormButtons ? null : (
						<Col span={span}>
							<Form.Item className="mb-0">
								<Button.Group>
									<Button type="primary" htmlType="submit">
										{globalConfig.searchText}
									</Button>
									<Button
										onClick={() => {
											resetFields()
											onSearch()
										}}
									>
										{globalConfig.clearText}
									</Button>
								</Button.Group>
								{finalItems.length >= maxItemsPerLine && enableFormCollapse ? (
									<Button type="link" onClick={() => setCollapsed((s) => !s)}>
										{collapsed ? globalConfig.expandText : globalConfig.closeText}
										{collapsed ? <DownOutlined /> : <UpOutlined />}
									</Button>
								) : null}
							</Form.Item>
						</Col>
					)}
				</Row>
			</Form>
		</div>
	)
})

export default SearchForm

function getInitialValues(
	searchParams: URLSearchParams,
	queryToFormObject: any,
	queryKeyByFormKey: any,
	defaultValues: Record<string, any>
) {
	const result = {}
	const query = copyFromSearchParams(searchParams)

	for (const key in query) {
		if (key[0] !== '_') {
			const queryItem = queryKeyByFormKey[key]
			if (queryItem) {
				const { type, index, key: originKey } = queryItem
				if (type === 'rangePicker' || type === 'rangeInput') {
					(result[originKey] ||= [])[index] = query[key]
				}
			} else {
				result[key] = query[key]
			}
		}
	}

	for (const key in result) {
		const item = queryToFormObject[key]
		if (item) {
			if (item.type === 'rangePicker') {
				result[key] = item.handler(...result[key])
			} else if (item.type === 'rangeInput') {
				result[key] = item.handler(...result[key])
			} else {
				result[key] = item.handler(result[key])
			}
		}
	}

	return {
		...defaultValues,
		...result
	}
}
