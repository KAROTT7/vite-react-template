import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useStore } from '@/contexts/store'

export function Component() {
	const location = useLocation()
	const { user } = useStore()
	useEffect(() => {
		// console.log(user)
	}, [location.pathname])

	return (
		<div>
			{user.name}
			<Outlet />
		</div>
	)
}
