import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import cl from 'classnames'
import type { MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number]

interface AsideProps {
	className?: string
	width: number
	menus: MenuItem[]
	collapsed: boolean
	toggleCollaspsed: () => void
	beforeNavigate?: (path: string) => string
}
export default function Aside(props: AsideProps) {
	const { className, width, collapsed, toggleCollaspsed, menus, beforeNavigate } = props

	const n = useNavigate()
	const { pathname } = useLocation()
	const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname])
	const [openKeys, setOpenKeys] = useState<string[]>([])

	useEffect(() => {
		const paths = pathname.split('/')
		let nextOpenKeys: string[]
		if (paths.length <= 2) {
			nextOpenKeys = []
		}

		let lastPath = ''
		nextOpenKeys = paths.slice(1, -1).reduce((result, p) => {
			result.push((lastPath += `/${p}`))
			return result
		}, [] as string[])

		setOpenKeys(nextOpenKeys)
		setSelectedKeys([pathname])
	}, [pathname])

	return (
		<div
			className={cl('aside absolute left-0 top-0 transition-all h-full', className)}
			style={{ width }}
		>
			<div
				className="group absolute -right-3 top-4 w-6 h-6 all-center bg-white rounded-full z-50 cursor-pointer"
				style={{
					boxShadow:
						'0 2px 8px -2px rgba(0,0,0,0.05),0 1px 4px -1px rgba(25,15,15,0.07),0 0 1px 0 rgba(0,0,0,0.08)'
				}}
				onClick={toggleCollaspsed}
			>
				<svg
					className={`w-4 fill-[#00000040] group-hover:fill-black ${
						collapsed ? '-rotate-90' : 'rotate-90'
					}`}
					viewBox="0 0 12 12"
					aria-hidden="true"
				>
					<path d="M6.432 7.967a.448.448 0 01-.318.133h-.228a.46.46 0 01-.318-.133L2.488 4.85a.305.305 0 010-.43l.427-.43a.293.293 0 01.42 0L6 6.687l2.665-2.699a.299.299 0 01.426 0l.42.431a.305.305 0 010 .43L6.432 7.967z"></path>
				</svg>
			</div>

			<Menu
				items={menus}
				inlineCollapsed={collapsed}
				selectedKeys={selectedKeys}
				openKeys={openKeys}
				getPopupContainer={() => document.getElementById('aside-popup')!}
				mode="inline"
				className="h-full w-full overflow-y-scroll overflow-x-hidden select-none pt-2 px-2"
				// inlineIndent={0}
				onClick={(info) => {
					const { key, keyPath } = info

					n(beforeNavigate?.(key) ?? key)
					setSelectedKeys([key])
					setOpenKeys(keyPath.slice(1))
				}}
				onOpenChange={(nextOpenKeys) => {
					setOpenKeys(nextOpenKeys)
				}}
			/>
		</div>
	)
}
