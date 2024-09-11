import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { setToken } from '@/utils/web'

export function Component() {
	const navigate = useNavigate()

	return (
		<div className="h-screen bg-[#fafafa]">
			<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg p-10 w-[400px] rounded-xl">
				<div className="text-center text-2xl font-semibold">{import.meta.env.VITE_APP_TITLE}</div>
				<Form
					className="mt-4"
					onFinish={(values) => {
						if (values) {
							setToken('token')
							navigate('/')
						}
					}}
				>
					<Form.Item name="username" rules={[{ required: true, message: ' ' }]}>
						<Input prefix={<UserOutlined />} />
					</Form.Item>
					<Form.Item name="password" rules={[{ required: true, message: ' ' }]}>
						<Input.Password prefix={<LockOutlined />} />
					</Form.Item>
					<Form.Item className="mb-0">
						<Button block type="primary" htmlType="submit">
							登录
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	)
}
