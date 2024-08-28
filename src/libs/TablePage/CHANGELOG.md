## 2024-08-21 v1.0.1

- fix: 修复无限滚动状态下 table 高度不正确的问题

## 2024-08-21 v1.0.0

- feat: TablePage 的 onChange 增加 action 用户判断查询类型

- feat: TablePage 设置成无限滚动组件时，折叠/展开 Form 时，会自动更新 Table 高度

- chore: 增加 meta.json 记录版本信息

- feat: 增加 TablePage.hiddenFormButtons 属性，隐藏 form 查询、重置按钮

## 2024-08-21

- feat: TablePage 支持配置 Form 属性

- feat: select.enums 自动过滤不合法的 Option
  ```js
  search: {
  	// 例子一
  	enums: {
  		'': 'a' // 将被过滤
  	}
  	// 例子二
  	enums: [
  		'', // 将被过滤
  		'a'
  	]
  	// 例子二
  	enums: [
  		{ label: 'a', value: 'a' },
  		'', // 将被过滤
  		null, // 将被过滤
  		undefined, // 将被过滤
  		false // 将被过滤
  	]
  }
  ```
