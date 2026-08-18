# life-admin

博客内容管理后台（Life 管理后台）。

技术栈：Vue 3 + TypeScript + Vite + Element Plus + Tailwind CSS v4 + Vue Router 5 + Pinia + axios + md-editor-v3。

## 开发

```bash
npm install
npm run dev    # http://localhost:5173，/api 代理到 http://localhost:8080
```

## 构建

```bash
npm run build  # vue-tsc 类型检查 + vite 打包，产物在 dist/
```

## 后端约定

- 接口 HOST：`http://localhost:8080/api`，接口文档见用户桌面 `default.md`。
- 统一响应 `{ code, message, data }`，`code === 0` 为成功；分页响应 `{ pageNum, pageSize, total, pages, records }`。
- 认证：登录返回 token，后续请求带 `Authorization: Bearer <token>`。
- 登录响应中 token 字段名文档未写明，当前按 `data.token` 解析（见 `src/api/types.ts` 的 `LoginResult`），联调不一致时改这里。
- 修改密码接口文档要求 `userId`/`username`，前端提交 `userId: 0` + 登录用户名（见 `src/views/password/index.vue`），后端若从 token 解析可忽略。
- 文章保存：`BlogCreateDTO.categoryId` 是 string、`BlogVO.categoryId` 是 number（前端提交按 string，见 `src/api/types.ts`），若保存文章报类型错误先检查这里。

## 联调验收清单（需后端运行在 localhost:8080）

按顺序逐项验证，任一失败记录并修复：

1. 登录：正确账号密码 → 进入仪表盘；错误密码 → 顶部红条报错。
2. 登录响应字段：确认后端返回的 token 字段名（当前按 `data.token`，不一致改 `src/api/types.ts` 的 `LoginResult`）。
3. 仪表盘：四个统计卡片数字与后端数据一致；点击卡片跳对应页面。
4. 文章管理：列表分页、标题搜索、分类筛选、发布/置顶开关、删除（含确认框）、新增跳转编辑页。
5. 文章编辑：新建保存后列表可见；编辑回填（分类/首图/内容/发布状态）；正文 Markdown 预览正常；words/readTime 自动计算。
6. 分类管理 / 标签管理 / 动态管理：增删改、分页、标签颜色选择器。
7. 评论管理：树形展开、按文章筛选（筛选下拉仅前 100 篇文章）、操作按钮为禁用占位（后端暂无审核/删除接口）。
8. 修改密码：旧密码错 → 报错；成功 → 自动登出跳登录页，用新密码重新登录成功。**务必确认后端忽略前端提交的 userId/username、从 token 解析用户**（若后端信任这两个字段则存在越权风险，需去掉）。
9. 401：登录后在浏览器 DevTools 执行 `localStorage.removeItem('life-admin-token')`，点任意操作 → 提示"登录已过期"并跳回登录页（保留原页面 redirect）。
10. 刷新任意内页：仍在原页面（token 持久化生效）。
