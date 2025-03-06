import { Transition } from '@headlessui/react'
import cl from 'classnames'
import { useRef, useState } from 'react'

export function Component() {
	const [open, setOpen] = useState(false)

	const ref = useRef<HTMLDivElement>(null)

	return (
		<div>
			{/* {Array.from({ length: 1000 }).map((_, index) => {
				return (
					<div key={index}>{index}</div>
				)
			})} */}
			<button onClick={() => setOpen(!open)}>toggle</button>
			<Transition
				show={open}
				unmount={false}
				enterFrom="opacity-0 h-0"
				enterTo="opacity-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0 h-0"
				afterEnter={() => {
					// ref.current?.style.setProperty('height', '0px')
					console.log(ref.current.clientHeight)
					setTimeout(() => {
						ref.current?.style.setProperty('height', ref.current.clientHeight + 'px')
					}, 100)
				}}
				// afterEnter={() => {
				// 	ref.current?.style.setProperty('height', ref.current.clientHeight + 'px')
				// }}
				beforeLeave={() => {
					// ref.current?.style.setProperty('height', ref.current.clientHeight + 'px')
				}}
				// afterLeave={() => {
				// 	ref.current?.style.setProperty('height', '0px')
				// }}
			>
				<div
					className={cl('w-10 bg-red-500 transition-all duration-1000')}
					ref={ref}
				>
					<div>12312312321123</div>
					<div>12312312321123</div>
					<div>12312312321123</div>
					<div>12312312321123</div>
					<div>12312312321123</div>
					<div>12312312321123</div>
					<div>12312312321123</div>
				</div>
			</Transition>

			<Input />
		</div>
	)
}

function Input() {
	const [value, setValue] = useState('')
	const ref = useRef<HTMLInputElement>(null)

	return (
		<div onClick={() => {}}>
			<input
				ref={ref}
				type="text"
				className="text-right border outline-none"
				value={value}
				onClick={() => {
					ref.current?.focus()
					ref.current?.setSelectionRange(value.length, value.length)
				}}
				onChange={e => {
					let v = e.target.value
					console.log(v)
					setValue(e.target.value)
				}}
			/>
		</div>
	)
}
