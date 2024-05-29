import React, { useMemo, isValidElement } from 'react'
import cl from 'classnames'
import Administrator from './Administrator'
import type { AdministratorProps } from './Administrator'
import { ensureArray } from './utils'
import Action from './Action'
import type { ActionProps } from './Action'

export interface HeaderProps {
	administrator: string | AdministratorProps
	className?: string
	logo?: string | string[] | React.ReactElement
	action?: ActionProps | ActionProps[]
}
export default function Header(props: HeaderProps) {
	const { className, logo, administrator, action } = props

	const logoNode = useMemo(() => {
		if (isValidElement(logo)) {
			return logo
		} else if (typeof logo === 'string' || Array.isArray(logo)) {
			return ensureArray(logo).map((o) => <img src={o} key={o} className="h-7" alt="" />)
		}

		return null
	}, [logo])

	const administratorProps = useMemo(() => {
		if (typeof administrator === 'string') {
			return {
				name: administrator
			}
		}

		return administrator
	}, [administrator])

	return (
		<div className={cl('border-b px-4 flex justify-between items-center h-14', className)}>
			<div className="flex items-center space-x-2">{logoNode}</div>

			<div className="flex items-center space-x-2">
				{ensureArray(action).map((item, i) => (
					<Action key={i} {...item} />
				))}
				<Administrator {...administratorProps} />
			</div>
		</div>
	)
}
