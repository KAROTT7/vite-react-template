import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from 'route-views'
import ErrorElement from '@/components/ErrorElement'

routes[0].errorElement = <ErrorElement />

const router = createBrowserRouter(routes)

function App() {
	return <RouterProvider router={router} />
}

export default App
