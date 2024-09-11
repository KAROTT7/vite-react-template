import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@/contexts/store'
import { Layout } from '@/components'
import { HomeOutlined } from '@ant-design/icons'
import { getToken, removeToken } from '@/utils/web'
export { default as ErrorBoundary } from '@/components/ErrorBoundary'
import { PoweroffOutlined } from '@ant-design/icons'

function BasicLayout(props: React.PropsWithChildren) {
	const { children } = props

	const navigate = useNavigate()
	const location = useLocation()
	const { user } = useStore()

	useEffect(() => {
		// console.log(user)
	}, [location.pathname])

	return (
		<Layout
			header={{
				className: 'bg-white',
				logo: '/vite.svg',
				administrator: {
					name: user?.name || 'admin',
					menu: {
						onClick(info) {
							if (info.key === 'logout') {
								removeToken()
								navigate('/login', { replace: true })
							}
						},
						items: [
							{
								label: '退出登录',
								key: 'logout',
								icon: <PoweroffOutlined />
							}
						]
					}
				}
			}}
			menus={[
				{
					key: '/',
					label: 'Home',
					icon: <HomeOutlined />
				},
				{
					key: '/template',
					label: 'Template',
					icon: <HomeOutlined />
				}
			]}
			asideProps={{ className: 'bg-white' }}
		>
			{/* {user?.name} */}
			<div className="p-3">{children}</div>
		</Layout>
	)
}

export function Component() {
	const { pathname } = useLocation()
	const token = getToken()

	const node = <Outlet />

	if (pathname === '/login') {
		return node
	}

	if (!token) {
		return <Navigate to="/login" replace />
	}

	return <BasicLayout>{node}</BasicLayout>
}
