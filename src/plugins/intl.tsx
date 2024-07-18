import { useStore } from '@/contexts/store'
import {
	createContext, useCallback, useContext 
} from 'react'
import locales from '@/locales'

interface FormatMessageFunctionOption {
	id: string
}

interface FormatMessageFunction {
	(v: FormatMessageFunctionOption | string, ...args: (string | number)[]): string
}

export interface IntlShape {
	formatMessage: FormatMessageFunction
}

interface ContextProps {
	locale: Lang
	messages: Record<string, any>
	formatMessage: FormatMessageFunction
	formatNumber(v: number): string
}
const Context = createContext<ContextProps>(null!)
if (import.meta.env.DEV) {
	Context.displayName = 'LocaleContext'
}

export function LocaleProvider(
	props: React.PropsWithChildren<Partial<Omit<ContextProps, 'formatMessage'>>>
) {
	const {
		children, messages, locale 
	} = props
	const lang = locale || useStore().lang
	const map = messages || locales

	const formatMessage = useCallback<FormatMessageFunction>(
		(opts, ...rest) => {
			const id = typeof opts === 'string' ? opts : opts.id
			const message = map[lang]
			// 如果未定义则返回 id
			let result = message[id] || id

			if (Array.isArray(rest)) {
				rest.forEach((value) => {
					result = result.replace(/{}/, value)
				})
			}

			return result
		},
		[lang, map]
	)

	function formatNumber(s: number) {
		return Number(s).toLocaleString()
	}

	return (
		<Context.Provider
			value={{
				locale: lang,
				messages: map,
				formatMessage,
				formatNumber
			}}
		>
			{children}
		</Context.Provider>
	)
}

export function useIntl() {
	return useContext(Context)
}

interface FormattedMessageProps {
	id: string
}
export function FormattedMessage({ id }: FormattedMessageProps) {
	const { formatMessage } = useIntl()
	return <>{formatMessage({ id })}</>
}
