import { useEffect, useRef, useState } from 'react'
import cl from 'classnames'
import { Row, Col, Form, Button } from 'antd'
import type { InputProps } from 'antd/es/input'
import type { TextAreaProps } from 'antd/es/input'
import type { SelectProps } from 'antd/es/select'
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker'
import type { Dayjs } from 'dayjs'

interface OptionItem {
	label: React.ReactNode
	value: React.ReactNode
}

interface BasicFormElement {
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
	 * @default 100
	 */
	order?: number
	/** 默认值 */
	defaultValue?: any
}

export type ConvertInFunction =
	| ((value?: string) => string[] | undefined)
	| ((value: string | number) => Dayjs)
	| ((start: string | number, end: string | number) => [Dayjs, Dayjs])

export type ConvertOutFunction =
	| ((value: [Dayjs, Dayjs]) => { [key: string]: string })
	| ((value: string[]) => string)
	| ((value: Dayjs) => string)

export interface BasicFormElementWithElement extends BasicFormElement {
	/**
	 * 不用用户定义，而是依据 type 字段自动生成
	 */
	element?: React.ReactNode
	/**
	 * query 参数转换成 form 值
	 */
	convertIn?: ConvertInFunction
	/**
	 * form 值转换成 query 参数
	 */
	convertOut?: ConvertOutFunction
}

interface InputObject extends BasicFormElement {
	type: 'input'
	elementProps?: InputProps
}

interface SelectObject extends BasicFormElement {
	type: 'select'
	enums: Record<string, string> | OptionItem[] | string[]
	elementProps?: SelectProps
}

interface RangePickerObject extends BasicFormElement {
	type: 'rangePicker'
	elementProps?: RangePickerProps
}

interface DatePickerObject extends BasicFormElement {
	type: 'datePicker'
	elementProps?: DatePickerProps
}

interface TextAreaObject extends BasicFormElement {
	type: 'textarea'
	elementProps?: TextAreaProps
}

interface RangeInputObject extends BasicFormElement {
	type: 'rangeInput'
}

interface CustomElementObject extends BasicFormElement {
	type: 'custom'
	element: React.ReactNode
}

export type FormElement =
	| InputObject
	| SelectObject
	| RangePickerObject
	| DatePickerObject
	| TextAreaObject
	| RangeInputObject
	| CustomElementObject

interface SearchFormProps<T> {
	className?: string
	items: BasicFormElementWithElement[]
	onSearch(values?: T): void
	initialValues?: T
	defaultValues?: Record<string, any>
}
export default function SearchForm<T = any>(props: SearchFormProps<T>) {
	const { className, items, onSearch, initialValues, defaultValues = {} } = props

	const [form] = Form.useForm()
	const wrapperRef = useRef<HTMLDivElement>()

	function resetFields() {
		// form.resetFields() 无效，故使用以下方式重置
		const resetValues = items.reduce((final, item) => {
			final[item.name] = defaultValues[item.name] ?? undefined
			return final
		}, {} as any)

		form.setFieldsValue(resetValues)
	}

	const [span, setSpan] = useState(6)

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
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
		})

		resizeObserver.observe(wrapperRef.current)

		return () => {
			resizeObserver.unobserve(wrapperRef.current)
		}
	}, [])

	return (
		<div ref={wrapperRef} className={cl('bg-white p-4 rounded mb-3 shadow-sm', className)}>
			<Form form={form} onFinish={onSearch} initialValues={initialValues}>
				<Row gutter={[15, 15]}>
					{items.map((o) => {
						return (
							<Col key={o.name} span={span}>
								<Form.Item name={o.name} className="mb-0">
									{o.element}
								</Form.Item>
							</Col>
						)
					})}
					<Col span={span}>
						<Form.Item className="mb-0">
							<Button.Group>
								<Button type="primary" htmlType="submit">
									Search
								</Button>
								<Button
									onClick={() => {
										resetFields()
										onSearch()
									}}
								>
									Clear
								</Button>
							</Button.Group>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</div>
	)
}
