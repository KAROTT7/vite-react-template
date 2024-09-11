const TOKEN = 'Token'
export const setToken: (v: string) => void = (token) => localStorage.setItem(TOKEN, token)
export const getToken = (): string | null => localStorage.getItem(TOKEN)
export const removeToken = (): void => localStorage.removeItem(TOKEN)
