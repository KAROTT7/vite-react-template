import cl from 'classnames'
import { useEffect, useMemo, useRef } from 'react'
import { Table, Row, Col } from 'antd'
import SearchForm from './SearchForm'
import type {
	FormElement,
	BasicFormElementWithElement,
	ConvertInFunction,
	ConvertOutFunction
} from './SearchForm'
import type { ColumnType, TableProps } from 'antd/es/table'
import getElement from './getElement'
import { useSearchParams } from 'react-router-dom'
import { isVoid } from '@/utils/misc'

export interface TableColumn<T = any> extends ColumnType<T> {
	search?: FormElement
}

interface ConvertFunctionMap {
	[key: string]: {
		in: ConvertInFunction
		out: ConvertOutFunction
	}
}

function filter(values: Record<string, unknown>) {
	Object.keys(values).forEach((key) => {
		const value = values[key]
		if (value == '' || isVoid(value)) {
			delete values[key]
		}
	})

	return values
}

function parseSummary(slot?: any): React.ReactElement {
	if (!slot) return slot

	if (slot.left != null || slot.right != null) {
		return (
			<Row justify="space-between" className="mb-3">
				<Col>{slot.left}</Col>
				<Col>{slot.right}</Col>
			</Row>
		)
	}

	return slot
}

interface Summary {
	left?: React.ReactNode
	right?: React.ReactNode
}

interface TableData<T> {
	list: T[]
	currentPage: number
	pageSize: number
	total: number
}

const DEFAULT_PAGE_INFO = {
	_currentPage: '1',
	_pageSize: '10'
}

// const DEFAULT_TABLE_DATA: TableData<any> = {
// 	list: [],
// 	current: 1,
// 	pageSize: 10,
// 	total: 1
// }

function getInitialValues(
	searchParams: URLSearchParams,
	defaultValues: Record<string, any>,
	convertsMap: ConvertFunctionMap
) {
	const result = { ...defaultValues }

	for (const [key, value] of searchParams) {
		if (!/^_/.test(key)) {
			let convert = convertsMap[key]?.in

			if (/(Start|End)$/.test(key)) {
				let originKey: string, start: string, end: string
				if (/Start$/.test(key)) {
					originKey = key.slice(0, -5)
					start = value
					end = searchParams.get(`${originKey}End`)
				} else {
					originKey = key.slice(0, -3)
					start = searchParams.get(`${originKey}Start`)
					end = value
				}

				convert = convertsMap[originKey]?.in

				if (!result[originKey]) {
					result[originKey] = convert(start, end)
				}
			} else {
				result[key] = convert ? convert(value) : value
			}
		}
	}

	return result
}

interface TablePageProps<T> {
	/** 容器样式 */
	className?: string
	/** search 容器样式 */
	searchWrapperClass?: string
	/** table 容器样式 */
	tableWrapperClass?: string
	columns: TableColumn<T>[]
	/** 表格数据 */
	tableData?: TableData<T>
	/** table props - 参考 antd table */
	tableProps?: Omit<TableProps<T>, 'columns'>
	/** 总结栏 */
	summary?: Summary | React.ReactElement
	/** 不变的 query 参数 */
	permanentQuery?: Record<string, string | string[]>
	/** 查询参数变更时 */
	onSearchParamsChange?(v: Record<string, string | number>): void
	container: HTMLElement
}
export default function TablePage<T = unknown>(props: React.PropsWithChildren<TablePageProps<T>>) {
	const {
		className,
		searchWrapperClass,
		tableWrapperClass,
		columns = [],
		tableProps = {},
		summary,
		tableData,
		permanentQuery = {},
		onSearchParamsChange,
		container = document.body
	} = props

	const [searchParams, setSearchParams] = useSearchParams()

	const tableElementRef = useRef<HTMLDivElement>()
	const userActionRef = useRef<'paginate' | 'filter' | 'sort' | 'search'>()

	useEffect(() => {
		const result: Record<string, string | number> = {
			currentPage: 1,
			pageSize: 10
		}
		for (const [key, value] of searchParams) {
			if (key[0] === '_') {
				result[key.slice(1)] = value
			} else {
				result[key] = value
			}
		}

		onSearchParamsChange?.(result)
	}, [searchParams])

	useEffect(() => {
		if (userActionRef.current === 'paginate') {
			container?.scrollTo(0, tableElementRef.current.offsetTop)
		}
	}, [tableData])

	const { tableColumns, formItems, formDefaultValues, convertsMap } = useMemo(() => {
		const tableColumns: TableColumn<T>[] = []
		let formItems: BasicFormElementWithElement[] = []
		const formDefaultValues: Record<string, any> = {}
		const convertsMap: ConvertFunctionMap = {}

		columns.forEach((column, index) => {
			if (column.dataIndex != null || column.title != null) {
				column.align ||= 'center'
				column.showSorterTooltip ||= false

				tableColumns.push(column)
			}

			if (column.search) {
				const itemEl = getElement(column, index)
				formDefaultValues[itemEl.name] = itemEl.defaultValue
				convertsMap[itemEl.name] = {
					in: itemEl.convertIn,
					out: itemEl.convertOut
				}
				formItems.push(itemEl)
			}
		})

		formItems = formItems.sort((a, b) => a.order - b.order)

		return {
			tableColumns,
			formItems,
			formDefaultValues,
			convertsMap
		}
	}, [columns])

	const summaryElement = parseSummary(summary)

	const pageSizeRef = useRef(10)
	const formValuesRef = useRef({})

	return (
		<div className={cl('m-4', className)}>
			{formItems.length ? (
				<SearchForm
					className={searchWrapperClass}
					initialValues={getInitialValues(searchParams, formDefaultValues, convertsMap)}
					defaultValues={formDefaultValues}
					items={formItems}
					onSearch={(values) => {
						const next = values ? filter(values) : {}
						Object.keys(next).forEach((key) => {
							const convert = convertsMap[key].out
							if (convert) {
								const result = convert(next[key] as any)
								if (typeof result === 'object') {
									delete next[key]

									Object.keys(result).forEach((k) => {
										next[k] = result[k]
									})
								} else {
									next[key] = result
								}
							}
						})

						formValuesRef.current = next
						userActionRef.current = 'search'

						setSearchParams(
							{
								...permanentQuery,
								...next,
								...DEFAULT_PAGE_INFO
							},
							{
								replace: true
							}
						)
					}}
				/>
			) : null}
			<div
				ref={tableElementRef}
				className={cl('p-4 bg-white shadow-sm rounded', tableWrapperClass)}
			>
				{summaryElement}
				<Table
					bordered
					rowKey="id"
					size="small"
					{...tableProps}
					dataSource={tableData.list}
					columns={tableColumns}
					onChange={(pagination, _, sorter, { action }) => {
						const { current, pageSize } = pagination

						userActionRef.current = action

						if (action === 'paginate') {
							// 判断每页条数是否一样，不一样则从第一页开始查询数据
							const nextPage = pageSizeRef.current === pageSize ? current : 1
							pageSizeRef.current = pageSize

							setSearchParams(
								{
									_currentPage: String(nextPage),
									_pageSize: String(pageSize),
									...formValuesRef.current,
									...permanentQuery
								},
								{ replace: true }
							)
						} else if (action === 'filter') {
							/** @TODO */
						} else if (action === 'sort') {
							const payload = filter({
								_sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
								_sortName: Array.isArray(sorter) ? undefined : sorter.column?.dataIndex
							})

							setSearchParams(
								{
									_currentPage: String(1),
									_pageSize: String(pageSize),
									...formValuesRef.current,
									...permanentQuery,
									...payload
								},
								{ replace: true }
							)
						}
					}}
					pagination={{
						rootClassName: '!mb-0',
						current: +(tableData.currentPage || 1),
						pageSize: +(tableData.pageSize || 10),
						total: tableData.total,
						showQuickJumper: true,
						size: 'default',
						showTotal: (t) => `总计 ${t} 条`,
						hideOnSinglePage: true
					}}
				/>
			</div>
		</div>
	)
}
