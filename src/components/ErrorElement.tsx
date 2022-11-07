import { useRouteError } from 'react-router-dom'

export default function ErrorElement() {
	const error = useRouteError()

	return <div>{JSON.stringify(error)}</div>
}
