import {
	useEffect, useMemo, useState, isValidElement 
} from 'react'
import Aside from './Aside'
import { MenuItem } from './Aside'
import Header from './Header'
import type { HeaderProps } from './Header'
import './layout.css'

const ASIDE_COLLAPSED = 'ASIDE_COLLAPSED'

interface AsideProps {
	className?: string
}

export interface LayoutProps {
	header?: React.ReactElement | HeaderProps
	menus: MenuItem[]
	asideProps?: AsideProps
	onAfterCollapsed?(collapsed: boolean): void
}
export default function Layout(props: React.PropsWithChildren<LayoutProps>) {
	const {
		header, children, menus, asideProps = {}, onAfterCollapsed 
	} = props

	const [config, setConfig] = useState(() => {
		return { collapsed: !!localStorage.getItem(ASIDE_COLLAPSED) }
	})

	useEffect(() => {
		if (config.collapsed) {
			localStorage.setItem(ASIDE_COLLAPSED, '1')
		} else {
			localStorage.removeItem(ASIDE_COLLAPSED)
		}

		onAfterCollapsed?.(config.collapsed)
	}, [config.collapsed])

	const headerNode = useMemo(() => {
		if (isValidElement(header)) {
			return header
		} else if (typeof header === 'object' && !('type' in header)) {
			return <Header {...header} />
		}

		return null
	}, [header])

	const left = config.collapsed ? 72 : 240

	return (
		<div className="h-screen grid" style={{ gridTemplateRows: `auto 1fr` }}>
			<div>{headerNode}</div>

			<div className="relative overflow-x-hidden">
				<Aside
					menus={menus}
					{...asideProps}
					collapsed={config.collapsed}
					toggleCollaspsed={() => {
						setConfig((s) => ({
							...s,
							collapsed: !s.collapsed
						}))
					}}
					width={left}
				/>

				<div
					className="transition-all h-full overflow-y-auto skypay-main"
					style={{
						marginLeft: left,
						width: `calc(100vw - ${left}px)`
					}}
					id="layout-container"
				>
					{children}
				</div>
			</div>
		</div>
	)
}
