import cl from 'classnames'
import { Transition } from '@headlessui/react'
import { useLocation } from 'react-router-dom'
import { cloneElement } from 'react'

export interface Menu {
	key: string
	title: string
	icon?: React.ReactElement
	children?: Menu[]
}

const menus: Menu[] = [
	{
		key: '/',
		title: 'Home',
		icon: <HomeIcon />
	},
	{
		key: '/transaction',
		title: 'Transaction List List List List',
		icon: <Icon />,
		children: [
			{
				key: '/transaction/list-0',
				title: 'List-0'
			},
			{
				key: '/transaction/list-1',
				title: 'List-1'
			},
			{
				key: '/transaction/list-2',
				title: 'List-2'
			}
		]
	},
	{
		key: '/system',
		title: 'System',
		icon: <Icon />
	}
]

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
	collapsed: boolean
}
export default function Menu(props: MenuProps) {
	const { collapsed, ...rest } = props

	const location = useLocation()

	return (
		<div
			{...rest}
			className="h-full overflow-y-auto overflow-x-hidden"
		>
			<ul className="overflow-x-hidden py-2">
				{menus.map(menu => {
					const hasChildren = menu.children && menu.children.length > 0

					return (
						<li
							key={menu.key}
							className={cl('mb-1 last:mb-0 select-none mx-2 overflow-x-hidden')}
						>
							<div
								className={cl(
									'h-9 group rounded flex items-center cursor-pointer w-full relative',
									location.pathname === menu.key ? 'active bg-primary' : 'hover:bg-primary/80'
								)}
							>
								<div className="flex items-center justify-center w-6 h-6 absolute left-2 top-1/2 -translate-y-1/2">
									{menu.icon
										? cloneElement(menu.icon, {
												className: 'group-hover:stroke-white group-[.active]:stroke-white'
											})
										: null}
								</div>
								<Transition show={!collapsed}>
									<div
										className={cl(
											'flex-1 ml-9 mr-1 flex items-center truncate transition-opacity group-hover:text-white group-[.active]:text-white',
											'data-[closed]:opacity-0',
											'',
											''
										)}
									>
										{menu.title}
									</div>
								</Transition>

								<Transition show={!collapsed}>
									<div
										className={cl(
											'w-6 h-6 flex items-center justify-center mr-1',
											hasChildren ? '' : 'invisible',
											'transition-all',
											'data-[closed]:opacity-0',
											'data-[enter]:delay-50',
											''
										)}
									>
										<ArrowDown className="group-hover:stroke-white group-[.active]:stroke-white" />
									</div>
								</Transition>
							</div>
							{hasChildren ? (
								<ul>
									{menu.children?.map(child => {
										return (
											<li
												key={child.key}
												className={cl('mt-1')}
											>
												<div className="px-2 py-2 bg-zinc-100 group rounded-lg flex space-x-2 cursor-pointer w-full">
													<div className="w-6 h-6" />
													<div className="flex-1">{child.title}</div>
												</div>
											</li>
										)
									})}
								</ul>
							) : null}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

interface IconProps {
	className?: string
}
function Icon(props: IconProps) {
	const { className } = props

	return (
		<svg
			className={cl('w-5 stroke-[#1C274C]', className)}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="9"
				cy="6"
				r="4"
				strokeWidth="1.5"
			/>
			<path
				d="M15 9C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M5.88915 20.5843C6.82627 20.8504 7.88256 21 9 21C12.866 21 16 19.2091 16 17C16 14.7909 12.866 13 9 13C5.13401 13 2 14.7909 2 17C2 17.3453 2.07657 17.6804 2.22053 18"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M18 14C19.7542 14.3847 21 15.3589 21 16.5C21 17.5293 19.9863 18.4229 18.5 18.8704"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function HomeIcon(props: IconProps) {
	const { className } = props

	return (
		<svg
			className={cl('w-5 stroke-[#1C274C]', className)}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M22 22L2 22"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M3 22.0001V11.3472C3 10.4903 3.36644 9.67432 4.00691 9.10502M21 22.0001V16M7.25345 6.2192L10.0069 3.77169C11.1436 2.76133 12.8564 2.76133 13.9931 3.77169L19.9931 9.10502C20.6336 9.67432 21 10.4903 21 11.3472V12"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M9 18.5H15"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M6 22V19M18 22V16C18 14.1144 18 13.1716 17.4142 12.5858C16.8284 12 15.8856 12 14 12H10C8.11438 12 7.17157 12 6.58579 12.5858C6.11424 13.0573 6.02228 13.7602 6.00434 15"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M10 9H10.5M14 9H12.5"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M9 15.5H10.5M15 15.5H12.5"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	)
}

function ArrowDown(props: IconProps) {
	const { className } = props

	return (
		<svg
			className={cl('w-5 stroke-[#1C274C]/80', className)}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19 9L12 15L5 9"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
