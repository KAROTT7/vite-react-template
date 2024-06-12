import {
	createContext, useContext, useState 
} from 'react'
import {
	produce, WritableDraft 
} from 'immer'

interface User {
	name: string
}

interface State {
	user?: User
}

interface StoreContextValues extends State {
	update(cb: (s: WritableDraft<State>) => void): void
}
const StoreContext = createContext<StoreContextValues>(null)

if (import.meta.env.DEV) {
	StoreContext.displayName = 'StoreContext'
}

export function StoreConfig(props: React.PropsWithChildren) {
	const { children } = props

	const [state, setState] = useState<State>({ user: undefined })

	return (
		<StoreContext.Provider
			value={{
				...state,
				update(fn) {
					setState((s) => {
						const next = produce(s, (draft) => {
							fn(draft)
						})

						return next
					})
				}
			}}
		>
			{children}
		</StoreContext.Provider>
	)
}

export function useStore() {
	return useContext(StoreContext)
}
