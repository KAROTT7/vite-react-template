import Panel from '@/components/Panel'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Form, FormInstance, Input, Modal, Tree } from 'antd'
import { useImmer } from 'use-immer'

interface Menu {
	parentId: number
	id: number
	key: string
	title: string
	sort: number
}

const menus = [
	{
		parentId: 0,
		id: 1,
		key: '/',
		title: '首页',
		sort: 0
	},
	{
		parentId: 0,
		id: 2,
		key: '/transaction',
		title: '交易管理',
		sort: 1
	},
	{
		parentId: 2,
		id: 4,
		key: '/transaction/list',
		title: '订单列表',
		sort: 1
	},
	{
		parentId: 2,
		id: 5,
		key: '/transaction/send',
		title: 'Send 列表',
		sort: 0
	},
	{
		parentId: 0,
		id: 3,
		key: '/operation',
		title: '运营管理',
		sort: 2
	},
	{
		parentId: 3,
		id: 6,
		key: '/operation/message',
		title: '消息列表',
		sort: 0
	},
	{
		parentId: 3,
		id: 7,
		key: '/operation/activity',
		title: '活动列表',
		sort: 1
	},
	{
		parentId: 3,
		id: 8,
		key: '/operation/ad',
		title: '广告列表',
		sort: 3
	},
	{
		parentId: 3,
		id: 9,
		key: '/operation/lunbo',
		title: '轮播图列表',
		sort: 2
	},

	{
		parentId: 0,
		id: 10,
		key: '/finance',
		title: '财务管理',
		sort: 3
	},
	{
		parentId: 0,
		id: 11,
		key: '/risk',
		title: '风控管理',
		sort: 4
	},
	{
		parentId: 0,
		id: 12,
		key: '/system',
		title: '系统管理',
		sort: 5
	}
]

let id = menus.length

interface MenuTree extends Menu {
	children: MenuTree[]
}

function parseMenu(menus: Menu[]): [MenuTree[], Map<number, MenuTree>] {
	const tree: MenuTree[] = []
	const map = new Map<number, MenuTree>()

	// Initialize the map with all menu items
	menus.forEach(menu => {
		map.set(menu.id, { ...menu, children: [] })
	})

	// Build the tree structure
	menus.forEach(menu => {
		const node = map.get(menu.id)
		if (menu.parentId === 0) {
			tree.push(node!)
		} else {
			const parent = map.get(menu.parentId)
			if (parent) {
				parent.children.push(node!)
			}
		}
	})

	// Sort the tree at each level
	function sortTree(nodes: MenuTree[]) {
		nodes.sort((a, b) => a.sort - b.sort)
		nodes.forEach(node => sortTree(node.children))
	}

	sortTree(tree)

	return [tree, map]
}

function getAllChildren(menu: MenuTree): MenuTree[] {
	const children: MenuTree[] = []
	menu.children.forEach(child => {
		children.push(child)
		children.push(...getAllChildren(child))
	})

	return children
}

function getPrefixPath(path: string): [string, string] {
	const paths = path.split('/')
	const key = paths.pop()!
	return [key, paths.join('/') + '/']
}

export function Component() {
	const [state, setState] = useImmer(menus)

	const [parsedList, listMap] = useMemo(() => parseMenu(state), [state])

	return (
		<Panel>
			<ModalMenu
				btnTitle="添加根菜单"
				title="添加菜单"
				onOk={values => {
					setState(draft => {
						draft.push({
							parentId: 0,
							id: ++id,
							...values
						})
					})

					return false
				}}
			/>
			<Tree
				showLine
				defaultExpandAll
				selectable={false}
				treeData={parsedList}
				draggable
				onDrop={opt => {
					const { node: targetNode, dragNode } = opt

					if (targetNode.dragOver) {
						console.log('insert')
						// 拖动到目标节点内
						const list = targetNode.children.slice().filter(item => item.id !== dragNode.id)
						dragNode.parentId = targetNode.id
						list.unshift(dragNode)
						list.forEach((item, index) => {
							item.sort = index
						})

						setState(draft => {
							list.forEach(item => {
								const node = draft.find(i => i.id === item.id)
								if (node) {
									node.sort = item.sort
									node.parentId = item.parentId
								}
							})
						})
					} else if (targetNode.dragOverGapBottom) {
						console.log('bottom')
						// 拖动到目标节点下方
						const targetList =
							targetNode.parentId === 0
								? parsedList.slice()
								: listMap.get(targetNode.parentId)!.children.slice()
						const index = targetList.findIndex(item => item.id === targetNode.id)
						let list = targetList.slice(index + 1).filter(item => item.id !== dragNode.id)
						list.unshift(dragNode)

						list = list.map((item, index) => {
							return {
								sort: targetNode.sort + index + 1,
								id: item.id,
								parentId: targetNode.parentId,
								key: item.key,
								title: item.title,
								children: []
							}
						})

						setState(draft => {
							list.forEach(item => {
								const node = draft.find(i => i.id === item.id)
								if (node) {
									node.sort = item.sort
									node.parentId = item.parentId
								}
							})
						})
					} else if (targetNode.dragOverGapTop) {
						console.log('top')
						// 拖动到目标节点上方
						const targetList =
							targetNode.parentId === 0
								? parsedList.slice()
								: listMap.get(targetNode.parentId)!.children.slice()
						const index = targetList.findIndex(item => item.id === targetNode.id)
						let list = targetList.slice(index).filter(item => item.id !== dragNode.id)
						list.unshift(dragNode)

						list = list.map((item, index) => {
							return {
								sort: targetNode.sort + index,
								id: item.id,
								parentId: targetNode.parentId,
								key: item.key,
								title: item.title,
								children: []
							}
						})

						setState(draft => {
							list.forEach(item => {
								const node = draft.find(i => i.id === item.id)
								if (node) {
									node.sort = item.sort
									node.parentId = item.parentId
								}
							})
						})
					} else {
						console.log('insert into item which has children')
						// 下级拖动到上级（有子级）
						const targetList =
							targetNode.parentId === 0
								? parsedList.slice()
								: listMap.get(targetNode.parentId)!.children.slice()
						const index = targetList.findIndex(item => item.id === targetNode.id)
						let list = targetList.slice(index + 1).filter(item => item.id !== dragNode.id)
						list.unshift(dragNode)

						list = list.map((item, index) => {
							return {
								sort: targetNode.sort + index + 1,
								id: item.id,
								parentId: targetNode.parentId,
								key: item.key,
								title: item.title,
								children: []
							}
						})

						setState(draft => {
							list.forEach(item => {
								const node = draft.find(i => i.id === item.id)
								if (node) {
									node.sort = item.sort
									node.parentId = item.parentId
								}
							})
						})
					}
				}}
				titleRender={node => {
					let key = '/'
					let prefix = ''
					if (node.key !== '/') {
						;[key, prefix] = getPrefixPath(node.key)
					}

					return (
						<div className="flex space-x-2">
							<span>
								{node.id} - {node.title} ({node.key}) - {node.sort}
							</span>
							<ModalMenu
								type="edit"
								btnTitle="编辑"
								title="编辑菜单"
								initialValues={{
									key,
									title: node.title
								}}
								prefixPath={prefix}
								onOk={values => {
									setState(draft => {
										const item = draft.find(item => item.id === node.id)
										if (item) {
											Object.assign(item, values)
										}
									})
									return false
								}}
							/>
							{node.key !== '/' && (
								<ModalMenu
									type="edit"
									btnTitle="append"
									title="添加子菜单"
									prefixPath={node.key}
									onOk={values => {
										setState(draft => {
											draft.push({
												parentId: node.id,
												id: ++id,
												...values
											})
										})
										return false
									}}
								/>
							)}
							<span
								className="pointer"
								onClick={() => {
									if (node.children.length > 0) {
										Modal.confirm({
											title: `该菜单（${node.title}）下存在子菜单，确认删除此菜单以及所有子菜单？`,
											okText: 'Confirm',
											onOk() {
												const list = [node, ...getAllChildren(node)]
												setState(draft => {
													list.forEach(item => {
														const index = draft.findIndex(i => i.id === item.id)
														if (index !== -1) {
															draft.splice(index, 1)
														}
													})
												})
											}
										})
									} else {
										Modal.confirm({
											title: `确认删除此菜单（${node.title}）？`,
											okText: 'Confirm',
											onOk() {
												setState(draft => {
													const index = draft.findIndex(item => item.id === node.id)
													if (index !== -1) {
														draft.splice(index, 1)
													}
												})
											}
										})
									}
								}}
							>
								delete
							</span>
						</div>
					)
				}}
			/>
		</Panel>
	)
}

interface ModalMenuProps {
	type?: 'edit'
	btnTitle: string
	title: string
	onOk(values: any): boolean
	initialValues?: Record<string, any>
	prefixPath?: string
}
function ModalMenu(props: ModalMenuProps) {
	const { type, btnTitle, title, onOk, initialValues, prefixPath } = props

	const [open, setOpen] = useState(false)
	const ref = useRef<FormInstance>(null)

	function openModal() {
		setOpen(true)
	}

	useEffect(() => {
		if (open) {
			if (initialValues) {
				ref.current?.setFieldsValue(initialValues)
			}
		} else {
			ref.current?.resetFields()
		}
	}, [open])

	const btn =
		type === 'edit' ? (
			<span
				className="pointer"
				onClick={openModal}
			>
				{btnTitle}
			</span>
		) : (
			<Button
				type="primary"
				size="small"
				onClick={openModal}
			>
				{btnTitle}
			</Button>
		)

	return (
		<>
			<Modal
				title={title}
				open={open}
				maskClosable={false}
				okText="Confirm"
				onOk={() => {
					ref.current?.submit()
				}}
				onCancel={() => {
					setOpen(false)
				}}
			>
				<Form
					onFinish={values => {
						setOpen(
							onOk({
								...values,
								key: (prefixPath || '') + values.key
							})
						)
					}}
					ref={ref}
				>
					<Form.Item
						name="key"
						label="菜单路径"
						rules={[{ required: true, message: ' ' }]}
					>
						<Input addonBefore={prefixPath} />
					</Form.Item>
					<Form.Item
						name="title"
						label="菜单名称"
						rules={[{ required: true, message: ' ' }]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
			{btn}
		</>
	)
}
