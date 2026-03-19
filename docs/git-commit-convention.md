# Git Commit 规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范。

---

## 格式

```
<type>(<scope>): <subject>

[body]

[footer]
```

每次 commit 由三部分组成：**Header**（必填）、**Body**（可选）、**Footer**（可选）。

---

## Type 类型

| Type       | Emoji | 说明                                           |
|------------|-------|----------------------------------------------|
| `feat`     | ✨     | 新功能（feature）                              |
| `fix`      | 🐛     | Bug 修复                                       |
| `docs`     | 📝     | 文档变更（仅文档，不涉及代码逻辑）             |
| `style`    | 🎨     | 代码格式调整（不影响逻辑，如空格、分号等）     |
| `refactor` | ♻️     | 重构（既不是新功能也不是 Bug 修复）            |
| `perf`     | ⚡️     | 性能优化                                       |
| `test`     | ✅     | 增加或修改测试用例                             |
| `build`    | 📦     | 构建系统或外部依赖变更（如 pnpm、nuxt.config） |
| `ci`       | 🔧     | CI/CD 配置变更（如 GitHub Actions）            |
| `chore`    | 🔨     | 杂项维护（不修改 src 或 test 文件的其他改动）  |

> **Emoji 是可选的**，但推荐使用，可以让 commit 历史在视觉上更清晰。

---

## Scope 作用域

Scope 表示本次改动影响的模块，本项目约定以下 scope：

| Scope      | 说明                                                   |
|------------|------------------------------------------------------|
| `content`  | `/content` 目录下的 Markdown 文章内容                 |
| `ui`       | 通用 UI 组件（`/app/components/ui/` 下的原子组件）    |
| `config`   | `nuxt.config.ts`、`tailwind.config.ts` 等配置文件     |
| `router`   | 路由相关（页面文件、middleware、路由规则）             |
| `api`      | `/server/api/` 下的服务端接口（Phase 3 启用）         |
| `auth`     | 鉴权相关逻辑（Phase 3 启用）                          |
| `layout`   | 布局组件（`/app/layouts/`）                           |
| `seo`      | SEO 相关（meta、sitemap、robots、og 标签等）          |
| `blog`     | 博客业务逻辑（文章列表、详情、分类、标签等页面）      |

scope 可以省略，但有明确模块时建议填写。

---

## Subject 主题行规则

- 使用**祈使句**，动词开头（中文适用：「新增」「修复」「移除」「优化」「更新」）
- **不加句号**结尾
- 长度控制在 **50 个字符以内**（中文约 25 个汉字）
- 中英文均可，但同一项目保持统一风格

---

## Body 正文（可选）

- 用于解释**为什么**做此改动，而不是做了什么
- 与 Header 之间空一行
- 每行不超过 72 个字符

```
feat(blog): 新增文章标签筛选功能

用户反馈无法快速定位特定技术类型的文章，
新增标签云组件并支持多标签联合筛选，
提升内容的可发现性。
```

---

## Footer 页脚（可选）

### Breaking Changes

```
feat(api): 重构用户接口返回结构

BREAKING CHANGE: /api/user 接口返回字段 `username` 改为 `name`，
需要同步更新所有调用方。
```

### 关联 Issue

```
fix(content): 修复文章目录锚点跳转失效

Closes #12
Refs #8
```

---

## 完整示例

以下是本项目常见的 commit 示例：

```bash
# 新增功能
feat(blog): ✨ 新增文章归档页面（按年月分组）
feat(ui): ✨ 新增 CodeBlock 语法高亮组件
feat(content): ✨ 新增关于页面 Markdown 文件

# Bug 修复
fix(blog): 🐛 修复暗色模式下代码块背景色异常
fix(router): 🐛 修复文章详情页刷新后 404 问题

# 样式与 UI
style(ui): 🎨 统一卡片组件间距为 Tailwind gap-6
style(layout): 🎨 调整 Header 在移动端的布局层级

# 重构
refactor(blog): ♻️ 提取文章列表逻辑至 composable usePosts
refactor(ui): ♻️ 将 TagBadge 组件改为无状态纯展示组件

# 文档
docs: 📝 初始化项目文档结构
docs(content): 📝 新增第一篇博客文章「Hello EchoOtaku」

# 配置与构建
build(config): 📦 配置 @nuxt/content 启用 highlight 代码高亮
build(config): 📦 新增 tailwind.config.ts 自定义主题色
chore: 🔨 更新 .gitignore 忽略 .env 文件

# SEO
feat(seo): ✨ 新增 robots.txt 和 sitemap 自动生成
feat(seo): ✨ 配置文章页 Open Graph meta 标签

# 性能
perf(blog): ⚡️ 对文章列表图片启用懒加载
```

---

## 快速参考卡

```
✨ feat      → 新功能
🐛 fix       → 修 bug
📝 docs      → 改文档
🎨 style     → 改格式
♻️ refactor  → 重构
⚡️ perf      → 性能优化
✅ test      → 加测试
📦 build     → 改构建
🔧 ci        → 改 CI
🔨 chore     → 杂项
```

---

## 工具推荐

- **[Commitizen](https://github.com/commitizen/cz-cli)** — 交互式 commit 提示，让提交格式不出错
- **[Commitlint](https://commitlint.js.org/)** — commit message 格式自动校验（配合 husky git hook）
- **VS Code 插件**：`Conventional Commits`（插件 ID：`vivaxy.vscode-conventional-commits`）
- **Git Alias**：可在 `.gitconfig` 中配置常用缩写加速提交
