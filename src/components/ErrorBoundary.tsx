import { useRouteError } from 'react-router-dom'

export default function ErrorBoundary() {
	const error = useRouteError()

	return <div>{JSON.stringify(error)}</div>
}
