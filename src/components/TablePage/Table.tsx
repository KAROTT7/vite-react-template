import cl from 'classnames'
import { Table as AntdTable, type TableProps as AntdTableProps } from 'antd'

interface TableProps extends AntdTableProps {
	className?: string
}
export default function Table(props: TableProps) {
	const { className, ...tableProps } = props

	return (
		<div className={cl('p-4 bg-white shadow-sm rounded', className)}>
			<AntdTable {...tableProps} dataSource={[]} />
		</div>
	)
}
