import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useStore } from '@/contexts/store'
import { Layout } from '@/components'
import { HomeOutlined } from '@ant-design/icons'

export function Component() {
	const location = useLocation()
	const { user } = useStore()

	useEffect(() => {
		// console.log(user)
	}, [location.pathname])

	return (
		<Layout
			header={{
				className: 'bg-white',
				administrator: user?.name || 'admin',
				logo: '/vite.svg'
			}}
			menus={[
				{
					key: '/',
					label: 'Home',
					icon: <HomeOutlined />
				}
			]}
			asideProps={{ className: 'bg-white' }}
		>
			{/* {user?.name} */}
			<Outlet />
		</Layout>
	)
}
