import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export { TablePageConfig } from './context'
export { default, type TableColumn } from './TablePage'
