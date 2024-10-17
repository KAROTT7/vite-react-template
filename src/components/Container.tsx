import cl from 'classnames'

interface ContainerProps {
	className?: string
}
export default function Container(props: React.PropsWithChildren<ContainerProps>) {
	const { className, children } = props

	return <div className={cl('p-4', className)}>{children}</div>
}
