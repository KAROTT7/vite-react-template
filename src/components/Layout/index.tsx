import { useMemo, useState, isValidElement } from 'react'
import Aside, { type MenuItem } from './Aside'
import Header, { type HeaderProps } from './Header'
import './layout.css'

const SIDER_MODE = 'SIDER_MODE'

export type SiderMode = 'default' | 'collapsed' | 'expanded'

interface AsideProps {
	className?: string
}

interface LayoutState {
	siderMode: SiderMode
}

export interface LayoutProps {
	header?: React.ReactElement | HeaderProps
	menus: MenuItem[]
	asideProps?: AsideProps
	onSideModeChange?(mode: SiderMode): void
}
export default function Layout(props: React.PropsWithChildren<LayoutProps>) {
	const { header, children, menus, asideProps = {}, onSideModeChange } = props

	const [config, setConfig] = useState<LayoutState>({
		siderMode: (localStorage.getItem(SIDER_MODE) as SiderMode) ?? 'default'
	})

	const headerNode = useMemo(() => {
		if (isValidElement(header)) {
			return header
		} else if (typeof header === 'object' && !('type' in header)) {
			return <Header {...header} />
		}

		return null
	}, [header])

	const maxSiderWidth = 240
	const minSiderWidth = 56
	const isSiderExpanded = config.siderMode === 'expanded'
	const siderWidth = config.siderMode !== 'collapsed' ? maxSiderWidth : minSiderWidth

	const mainContentMarginLeft = isSiderExpanded
		? minSiderWidth
		: config.siderMode === 'collapsed'
			? minSiderWidth
			: maxSiderWidth

	return (
		<div
			className="h-screen grid bg-zinc-50"
			style={{ gridTemplateRows: 'auto 1fr' }}
		>
			<div>{headerNode}</div>

			<div className="relative overflow-x-hidden">
				<Aside
					menus={menus}
					{...asideProps}
					mode={config.siderMode}
					onModeChange={mode => {
						setConfig(s => ({
							...s,
							siderMode: mode
						}))
						localStorage.setItem(SIDER_MODE, mode)
						onSideModeChange?.(mode)
					}}
					width={siderWidth}
					className={config.siderMode}
				/>

				<div
					className="transition-all h-full overflow-y-auto skypay-main"
					style={{
						marginLeft: mainContentMarginLeft,
						width: `calc(100vw - ${mainContentMarginLeft}px)`
					}}
					id="layout-container"
				>
					{children}
				</div>
			</div>
		</div>
	)
}
