import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from 'route-views'
import ErrorElement from '@/components/ErrorElement'
import { StoreConfig } from '@/contexts/store'

routes[0].errorElement = <ErrorElement />

const router = createBrowserRouter(routes)

export default function App() {
	return (
		<StoreConfig>
			<RouterProvider router={router} />
		</StoreConfig>
	)
}
