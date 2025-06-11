import { generateService } from '@umijs/openapi'
// 利用umijs插件來自動根據接口文檔生成接口文件（需要啓動後端）
generateService({
  requestLibPath: "import request from '@/request'",
  schemaPath: 'http://localhost:8123/api/v2/api-docs',
  serversPath: './src',
})
