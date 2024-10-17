import { Dropdown, type DropdownProps } from 'antd'

export interface AdministratorProps extends DropdownProps {
	name: string
}
export default function Administrator(props: AdministratorProps) {
	const { name, ...dropdownProps } = props

	const node = (
		<div className="flex items-center space-x-2 px-2 rounded h-10 hover:bg-[rgba(0,0,0,0.03)] cursor-pointer">
			<div className="w-6 h-6 rounded-full bg-[#1C4C8D] text-white text-sm all-center shadow-md">
				{name?.slice(0, 1).toUpperCase()}
			</div>
			<div className="text-black/45 text-sm">{name}</div>
		</div>
	)

	if (Object.keys(dropdownProps).length) {
		return <Dropdown {...dropdownProps}>{node}</Dropdown>
	}

	return node
}
