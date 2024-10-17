import { Dropdown, type DropdownProps } from 'antd'

export interface ActionProps extends DropdownProps {
	icon: string | React.ReactElement
}
export default function Action(props: ActionProps) {
	const { icon, ...dropdownProps } = props

	const node = (
		<div className="w-10 h-10 all-center rounded hover:bg-[rgba(0,0,0,0.03)] cursor-pointer relative">
			<div className="w-2 h-2 rounded-full bg-red-400 shadow-xl absolute right-2 top-1" />
			{typeof icon === 'string' ? (
				<img
					className="w-5"
					src={icon}
					alt=""
				/>
			) : (
				icon
			)}
		</div>
	)

	if (Object.keys(dropdownProps).length) {
		return <Dropdown {...dropdownProps}>{node}</Dropdown>
	}

	return node
}
