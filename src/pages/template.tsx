// import { useIntl } from '@/plugins/intl'
import { useState } from 'react'
import { Space, Button } from 'antd'
import { TablePage } from '@/components'
// import { convertToTausendstel } from '@/utils/calc'
// import { splitedStringToArray, arrayToSplitedString } from '@/utils/utils'
// import { convertToLocale, composeRangeTime, decomposeRangeTime } from '@/utils/time'
// import { useAxios } from "@/utils/hooks"
import type { TableColumn } from '@/components/TablePage'
import { useSearchParams } from 'react-router-dom'
import { SortOrder } from 'antd/es/table/interface'

function getData(payload: any) {
	const { currentPage, pageSize } = payload

	return {
		total: 100,
		list: new Array(+pageSize).fill(0).map(() => {
			return {
				id: Math.random(),
				a: 'a',
				b: 'b',
				c: 'c',
				d: 'd',
				e: 'e'
			}
		}),
		pageSize,
		currentPage
	}
}

export function Component() {
	// const { formatMessage: f } = useIntl()
	// const {
	// 	trigger: getList,
	// 	loading,
	// 	data: tableData = {}
	// } = useAxios('/path/to/api')

	const [searchParams] = useSearchParams()
	const _sortName = searchParams.get('_sortName'),
		_sortOrder = searchParams.get('_sortOrder') as SortOrder

	const [tableData, setTableData] = useState({
		total: 0,
		currentPage: 1,
		pageSize: 10,
		list: []
	})

	const columns: TableColumn[] = [
		{
			title: 'ID',
			dataIndex: 'id'
		},
		{
			title: 'Order ID',
			dataIndex: 'a',
			search: {
				type: 'input'
				// order: 0
			}
		},
		{
			title: 'single select',
			dataIndex: 'b',
			search: {
				type: 'select',
				enums: ['A', 'B', 'C']
				// order: 0
			}
		},
		{
			title: 'Order Status',
			dataIndex: 'c',
			sorter: true,
			sortOrder: _sortName === 'c' ? _sortOrder : undefined,
			/**
			 * 通过 search 属性定义查询组件
			 */
			search: {
				// 组件类型
				type: 'select',
				/**
				 * 定义 Form.Item - name
				 * @default 取 column.dataIndex
				 */
				// name: '',
				/**
				 * 定义 Form.Item - label
				 * @default 取 column.title
				 */
				// label: '',
				/**
				 * 枚举：支持以下类型
				 * - string[]
				 * - Record<string, string>
				 * - { label: React.ReactNode; value: number | string }[]
				 */
				enums: ['A', 'B', 'C'],
				// 排序
				// order: 1,
				// 传给组件的属性
				elementProps: { mode: 'multiple' }
			}
		},
		{
			title: 'Created Time',
			dataIndex: 'd',
			// render: t => convertToLocale(t, 'date'),
			search: {
				type: 'rangePicker'
				// order: 2
			}
		},
		{
			title: 'Updated Time',
			dataIndex: 'e',
			// render: t => convertToLocale(t, 'date'),
			search: {
				type: 'datePicker'
				// order: 2
			}
		}
	]

	return (
		<TablePage
			summary={{
				left: (
					<Space>
						<Button size="small" type="primary">
							Export
						</Button>
					</Space>
				),
				right: null
			}}
			tableData={tableData}
			columns={columns}
			container={document.getElementById('layout-container')}
			onSearchParamsChange={(payload) => {
				setTableData(getData(payload))
			}}
		/>
	)
}

if (import.meta.env.DEV) {
	Component.displayName = 'Template'
}
