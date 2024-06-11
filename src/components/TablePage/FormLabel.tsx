interface FormLabelProps {
	focus?: boolean
	required?: boolean
}
export default function FormLabel(props: React.PropsWithChildren<FormLabelProps>) {
	const { children, focus, required } = props

	return (
		<span
			className={`absolute left-2 -top-[2px] z-10 leading-none -translate-y-1/2 h-3 bg-white text-sm transition-colors ${
				focus ? 'text-primary' : 'text-gray-700'
			}`}
		>
			{required ? <span className="text-red-500">* </span> : undefined}
			{children}
		</span>
	)
}
