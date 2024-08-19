import type { FormInstance, FormProps, TableProps } from 'antd'
import { createContext, useContext } from 'react'

export interface FormConfig
	extends Omit<FormProps, 'onFinish' | 'initialValues' | 'form' | 'onValuesChange'> {
	onValuesChange?(
		changed: Record<string, any>,
		allChangedValues: Record<string, any>,
		form: FormInstance
	): void
}

export interface TableKeysMap {
	list?: string
	current?: string
	pageSize?: string
	total?: string
}

export interface TableContextValue {
	formConfig?: FormConfig
	tableConfig?: Omit<TableProps<any>, 'dataSource' | 'columns' | 'onChange' | 'scroll'>
	tableDataMap?: TableKeysMap
	/** 查询文本 */
	searchText?: string
	/** 重置文本 */
	clearText?: string
	/** 折叠文本 */
	closeText?: string
	/** 展开文本 */
	expandText?: string
	selectAllText?: string
	rangePickerPlaceholder?: [string, string]
	/** 是否在点击搜索后折叠搜索项 */
	collapsedAfterSearch?: boolean
	/**
	 * Form Label 展示位置
	 * @default `absolute`
	 */
	labelPlacement?: 'absolute' | 'default'
	rowGutter?: number | [number, number]
	/** 是否将查询项时间值转换为 utc 时间 */
	utc?: boolean
	/** 滚动容器元素 */
	getContainer?: () => HTMLElement | null
	/** 使用启用查询项折叠展开功能 */
	enableFormCollapse?: boolean
}

const TableContext = createContext<TableContextValue | undefined>(null!)
if (import.meta.env.DEV) {
	TableContext.displayName = 'TableContext'
}

export function TablePageConfig(props: React.PropsWithChildren<TableContextValue | undefined>) {
	const { children, ...rest } = props

	return <TableContext.Provider value={rest}>{children}</TableContext.Provider>
}

export function useTablePageConfig() {
	const config = useContext(TableContext) || {}
	const { formConfig = {}, tableConfig = {}, ...rest } = config

	return {
		searchText: 'Search',
		clearText: 'Clear',
		closeText: 'Close',
		expandText: 'Expand',
		selectAllText: 'All',
		rangePickerPlaceholder: ['Start Date', 'End Date'],
		collapsedAfterSearch: false,
		labelPlacement: 'absolute',
		rowGutter: [15, 15],
		utc: true,
		...rest,
		formConfig,
		tableConfig: {
			bordered: true,
			rowKey: 'id',
			size: 'small',
			...tableConfig
		}
	} as TableContextValue
}
