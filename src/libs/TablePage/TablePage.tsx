import { useEffect, useMemo, useRef, useState } from 'react'
import { Table, Row, Col } from 'antd'
import cl from 'classnames'
import SearchForm, { AntdFormProps, type FormElement, type NormalizedItem } from './SearchForm'
import type { ColumnType, TableProps } from 'antd/es/table'
import { useLocation, useSearchParams } from 'react-router-dom'
import { copyFromSearchParams, type FormToQueryObject } from './getElement'
import { type TableKeysMap, useTablePageConfig } from './context'

export interface TableColumn<T = any> extends ColumnType<T> {
	search?: FormElement
}

function filter(values: Record<string, any>) {
	Object.keys(values).forEach((key) => {
		const value = values[key]
		if (value == '' || value == null) {
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

interface TablePageData<T = any> {
	list: T[]
	current: number
	pageSize: number
	total: number
}

type TableAction = 'paginate' | 'filter' | 'sort' | 'search'

function normalizeData(data: Partial<TablePageData> = {}, map: TableKeysMap = {}): TablePageData {
	return {
		current: data[map.current || 'current'] || 1,
		pageSize: data[map.pageSize || 'pageSize'] || 10,
		total: data[map.total || 'total'] || 10,
		list: data[map.list || 'list'] || []
	}
}

interface SearchFormInstance {
	formToQueryObject: FormToQueryObject
	formWrapper: HTMLDivElement
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
	tableData?: TablePageData<T>
	/** table props - 参考 antd table */
	tableProps?: Omit<TableProps<T>, 'columns' | 'dataSource' | 'scroll' | 'onScroll' | 'onChange'>
	/** 总结栏 */
	summary?: Summary | React.ReactElement
	/** 不变的 query 参数 */
	permanentQuery?: Record<string, string | string[]>
	/** 查询参数变更 */
	onChange?(v: Record<string, string | number>, action: TableAction): void
	/** 当分页变化时滚动到指定高度 */
	scrollToTop?: boolean | ((tableElement: HTMLDivElement) => number)
	/** 组件距离滚动容器顶部的高度 */
	offsetTop?: number
	/** Antd Form 属性 */
	formProps?: AntdFormProps
}
export default function TablePage<T = any>(props: React.PropsWithChildren<TablePageProps<T>>) {
	const {
		className,
		searchWrapperClass,
		tableWrapperClass,
		columns = [],
		tableProps = {},
		summary,
		tableData,
		permanentQuery = {},
		onChange,
		scrollToTop = true,
		offsetTop = 0,
		formProps = {}
	} = props

	const { tableConfig, tableDataMap, getContainer = () => document.body } = useTablePageConfig()

	const infiniteScroll = !!tableProps?.virtual || !!tableConfig?.virtual
	const container = getContainer()

	const [searchParams, setSearchParams] = useSearchParams()
	// 用于相同 searchParams 时，点击 search 刷新页面
	const location = useLocation()

	const data = normalizeData(tableData, tableDataMap)
	const tableElementRef = useRef<HTMLDivElement>(null)
	const actionRef = useRef<TableAction>('search')

	function getChangedParameters(
		searchParams: URLSearchParams,
		extraQuery: Record<string, any> = {}
	) {
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

		return {
			...result,
			...extraQuery
		}
	}

	useEffect(() => {
		const result = getChangedParameters(searchParams)

		onChange?.(result, actionRef.current)
	}, [searchParams, location])

	useEffect(() => {
		if (
			!infiniteScroll &&
			actionRef.current === 'paginate' &&
			tableElementRef.current &&
			scrollToTop !== false
		) {
			container?.scrollTo(
				0,
				typeof scrollToTop === 'function'
					? scrollToTop(tableElementRef.current)
					: tableElementRef.current.offsetTop - offsetTop
			)
		}
	}, [data, scrollToTop, infiniteScroll, offsetTop])

	const { tableColumns, formItems, totalWidth } = useMemo(() => {
		const tableColumns: ColumnType<T>[] = []
		const formItems: NormalizedItem[] = []
		let totalWidth = 0

		columns.forEach((column) => {
			const { search, ...rest } = column
			const hasColumn = rest.dataIndex != null || rest.title != null
			if (hasColumn) {
				totalWidth += Number(rest.width || 180)

				rest.align ||= 'center'
				rest.showSorterTooltip ||= false

				tableColumns.push(rest)
			}

			if (search) {
				if (hasColumn) {
					if (!search.name) {
						if (typeof rest.dataIndex !== 'string') {
							throw new TypeError('error: search.name 或 column.dataIndex 必须赋值且是字符串类型')
						}

						search.name = rest.dataIndex as string
					}

					if (!search.label) {
						if (typeof rest.title !== 'string') {
							throw new TypeError('error: search.label 或 column.title 必须赋值且是字符串类型')
						}

						search.label = rest.title as string
					}
				}

				formItems.push(search as NormalizedItem)
			}
		})

		return {
			tableColumns,
			formItems,
			totalWidth
		}
	}, [columns])

	const searchRef = useRef<SearchFormInstance>(null)

	/**
	 * 用于控制 form 查询表单是否折叠
	 * 放在此处是方便设置 table 高度
	 */
	const [collapsed, setCollapsed] = useState(false)
	const tableY = useScrollY(infiniteScroll, collapsed)

	return (
		<div className={cl(className)} id="table-page">
			{formItems.length ? (
				<SearchForm
					ref={searchRef}
					className={searchWrapperClass}
					searchs={formItems}
					formProps={formProps}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					onSearch={(values = {}) => {
						const next = filter(values)

						const { formToQueryObject } = searchRef.current!

						Object.keys(next).forEach((key) => {
							const item = formToQueryObject[key]
							if (item) {
								const result = item.handler(next[key] as any)
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

						actionRef.current = 'search'

						setSearchParams(
							{
								...permanentQuery,
								...next
							},
							{ replace: true }
						)

						if (infiniteScroll) {
							const scrollContainer = tableElementRef.current?.querySelector(
								'.ant-table-tbody-virtual-holder'
							)
							scrollContainer?.scrollTo(0, 0)
						}
					}}
				/>
			) : null}
			<div
				ref={tableElementRef}
				id="tableWrapper"
				className={cl(
					'p-4 bg-white shadow-sm rounded',
					tableWrapperClass,
					infiniteScroll ? 'flex-1' : ''
				)}
			>
				{parseSummary(summary)}
				<Table
					{...tableConfig}
					{...tableProps}
					scroll={{
						x: totalWidth,
						y: tableY
					}}
					dataSource={data.list}
					columns={tableColumns}
					virtual={infiniteScroll}
					onScroll={(e) => {
						if (infiniteScroll) {
							const el = e.target as HTMLElement
							const restCount = data.total % data.pageSize
							const totalPages = (data.total - restCount) / data.pageSize + (restCount > 0 ? 1 : 0)
							const hasNextPage = data.current < totalPages
							if (
								el.scrollHeight - el.scrollTop - el.clientHeight < 100 &&
								hasNextPage &&
								!tableProps.loading
							) {
								actionRef.current = 'paginate'
								const result = getChangedParameters(searchParams, {
									currentPage: String(data.current + 1)
								})

								onChange?.(result, actionRef.current)
							}
						}
					}}
					onChange={(pagination, _, sorter, { action }) => {
						const { current, pageSize } = pagination

						actionRef.current = action
						if (action === 'paginate') {
							setSearchParams(
								(s) => {
									const query = copyFromSearchParams(s)
									return {
										...query,
										...permanentQuery,
										_currentPage: String(pageSize != data.pageSize ? 1 : current),
										_pageSize: String(pageSize)
									}
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
								(s) => {
									const query = copyFromSearchParams(s, ['_sortOrder', '_sortName'])
									return {
										...query,
										...permanentQuery,
										...payload,
										_currentPage: '1',
										_pageSize: String(pageSize)
									}
								},
								{ replace: true }
							)
						}
					}}
					pagination={
						infiniteScroll
							? false
							: {
									rootClassName: '!mb-0',
									showQuickJumper: true,
									size: 'default',
									showTotal: (t) => `总计 ${t} 条`,
									hideOnSinglePage: true,
									position: ['bottomCenter'],
									...(tableConfig?.pagination || {}),
									current: data.current,
									pageSize: data.pageSize,
									total: data.total
							  }
					}
				/>
			</div>
		</div>
	)
}

function useScrollY(infiniteScroll: boolean, collapsed: boolean) {
	const location = useLocation()
	const [tableY, setTableY] = useState<number>()

	useEffect(() => {
		if (infiniteScroll) {
			setTimeout(() => {
				const tableContainer = document.getElementById('tableWrapper')

				// antd table 初始化时或者没数据时，挂载的是 ant-table-placeholder元素
				const scrollContainer =
					tableContainer?.querySelector('.ant-table-tbody-virtual') ||
					tableContainer?.querySelector('.ant-table-placeholder')
				const rect = scrollContainer!.getBoundingClientRect()!

				const tablePb = Number.parseInt(window.getComputedStyle(tableContainer!).paddingBottom)

				const tablePagePb = Number.parseInt(
					window.getComputedStyle(document.getElementById('table-page')!.parentElement!)
						.paddingBottom
				)

				setTableY(window.innerHeight - rect.top - tablePb - tablePagePb)
			}, 10)
		}
	}, [location, collapsed])

	return tableY
}
