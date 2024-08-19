import { useRouteError } from 'react-router-dom'

export default function ErrorBoundary() {
	const error = useRouteError() as any

	return (
		<div className="p-2">
			<div className="mb-2">Something was wrong!</div>
			<div>
				<pre>{error.stack || error.message}</pre>
			</div>
		</div>
	)
}
