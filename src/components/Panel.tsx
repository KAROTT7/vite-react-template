import React from 'react'
import { twMerge } from 'tailwind-merge'

interface PanelProps {
	className?: string
}
export default function Panel(props: React.PropsWithChildren<PanelProps>) {
	const { children, className } = props
	return <div className={twMerge('bg-white rounded-lg shadow-sm p-2', className)}>{children}</div>
}
