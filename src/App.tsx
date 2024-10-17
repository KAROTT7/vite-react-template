import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from 'route-views'
import { StoreConfig } from '@/contexts/store'

const router = createBrowserRouter(routes)

export default function App() {
	return (
		<StoreConfig>
			<RouterProvider router={router} />
		</StoreConfig>
	)
}
