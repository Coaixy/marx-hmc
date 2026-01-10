# 杭州医学院综合刷题助手 (hmc-study-platform)

<div align="center">

**高效学习，轻松备考**

一个功能完整、现代化的医学期末刷题平台

[反馈问题](https://github.com/coaixy/marix-yi/issues)

</div>

## 项目简介

综合刷题助手是一个专为医学生打造的在线刷题平台，支持多科目题库、多种学习模式、AI 智能解析等功能。基于 Next.js 14+ 开发，提供流畅的用户体验和强大的功能特性。

### 核心特性

- 📚 **多科目题库** - 支持马克思主义、生物化学、细胞生物学、临床基础检验、医事法学、临床生物化学等 6 个科目
- 🎯 **多种学习模式** - 顺序背题、随机练习、搜题模式、考试模式、错题本
- 🤖 **AI 智能功能** - 集成 DeepSeek AI，提供题目解析和智能答疑
- 💬 **社交互动** - 题目评论系统、排行榜、AI 答疑
- 📊 **数据统计** - 学习进度追踪、错题分析、考试成绩统计
- 🎨 **现代化 UI** - 基于 shadcn/ui，支持深色/浅色模式，流畅动画效果
- 📱 **移动端优化** - 响应式设计，移动端体验优先
- 💾 **数据持久化** - 本地存储 + 云端同步，离线也能使用

## 技术栈

### 前端框架

- **Next.js 16.0.7** - React 全栈框架，使用 App Router
- **React 19.2.0** - 最新版本的 React
- **TypeScript 5** - 类型安全的开发

### UI 组件库

- **Radix UI** - 无头 UI 组件库
- **shadcn/ui** - 现代化 UI 组件系统
- **Tailwind CSS 4.1.9** - 原子化 CSS 框架
- **Framer Motion 12** - 流畅的动画库
- **Lucide React** - 优雅的图标库

### 数据管理

- **MySQL2** - 数据库连接（评论、排行榜、用户配置等）
- **LocalStorage** - 本地数据存储（学习进度、错题记录等）

### 其他工具

- **React Hook Form** - 表单状态管理
- **Zod** - 模式验证
- **Recharts** - 数据可视化
- **Vercel Analytics** - 网站分析

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- pnpm 8.0 或更高版本
- MySQL 8.0 或更高版本（可选，用于评论和排行榜功能）

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

创建 `.env.local` 文件并配置以下环境变量：

```bash
# 数据库配置（可选）
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=marix_yi

# AI API 配置（可选，用于 AI 解析功能）
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### 初始化数据库（可选）

如果需要使用评论和排行榜功能，请先创建数据库并执行初始化脚本：

```bash
mysql -u root -p < lib/scheme.sql
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 功能介绍

### 1. 多种学习模式

#### 顺序背题模式 (/sequential)

- 按题库顺序逐题练习
- 支持题型分类（单选、多选、判断题等）
- 自动记录学习进度
- 支持继续上次学习位置

#### 随机练习模式 (/random)

- 随机抽取题目进行练习
- 避免重复，提高练习效率
- 支持题型筛选

#### 搜题模式 (/search)

- 支持题干内容搜索
- 实时搜索结果展示

#### 考试模式 (/exam)

- 模拟真实考试环境
- 完整的答题卡功能
- 自动统计成绩
- 考试记录保存到数据库

#### 错题本 (/errors)

- 自动收集错题
- 支持错题重练
- 按科目分类管理

### 2. AI 智能功能

#### AI 题目解析

- 集成 DeepSeek AI 模型
- 智能解释题目答案
- 解析结果缓存机制
- 每日使用次数限制（30次）

#### AI 答疑系统

- 评论区 AI 自动回复
- 针对题目的专业解答
- 支持上下文理解

### 3. 社交与互动功能

#### 题目评论系统

- 每道题目都有独立的评论区
- 支持多级评论回复
- AI 智能答疑
- 评论内容存储在数据库

#### 排行榜系统

- 全局考试成绩排行
- 按科目分类
- 显示用户昵称和成绩
- 实时更新

### 4. 数据统计与分析

- 学习进度追踪
- 错题统计分析
- 考试成绩统计
- 学习时长统计

## 项目结构

```
marix-yi/
├── app/                          # Next.js App Router 应用目录
│   ├── api/                      # API 路由
│   │   ├── ai-reply/            # AI 答疑 API
│   │   ├── chat/                # AI 聊天 API
│   │   ├── comments/            # 评论系统 API
│   │   ├── exam/                # 考试相关 API
│   │   └── user/                # 用户管理 API
│   ├── errors/                  # 错题本页面
│   ├── exam/                    # 考试模式页面
│   ├── random/                  # 随机练习页面
│   ├── ranking/                 # 排行榜页面
│   ├── search/                  # 搜题页面
│   └── sequential/              # 顺序背题页面
├── components/                   # React 组件
│   ├── ui/                      # shadcn UI 基础组件
│   ├── question-card.tsx        # 题目卡片组件
│   ├── question-comments.tsx    # 题目评论组件
│   ├── ai-explanation.tsx       # AI 解析组件
│   └── ...                      # 其他组件
├── lib/                         # 工具库和数据
│   ├── *.json                   # 题库数据文件
│   ├── db.ts                    # 数据库连接
│   ├── storage.ts               # 本地存储管理
│   └── question-data.ts         # 题目数据类型定义
└── public/                      # 静态资源
```

## 数据库设计

项目使用 MySQL 数据库存储评论、排行榜和用户配置等数据。数据库表结构如下：

### ai_answer_cache - AI 答案缓存表

存储 AI 解析结果，避免重复调用 API。

### exam_records - 考试记录表

记录用户考试成绩，用于生成排行榜。

### question_comments - 题目评论表

支持多级评论和 AI 回复。

### device_user_config - 用户配置表

存储用户昵称等个性化配置。

详细的表结构定义请查看 `lib/scheme.sql` 文件。

## 题库说明

项目目前包含 6 个科目的题库，存储在 `lib/` 目录下：

- `marix.json` - 马克思主义基本原理
- `bio.json` - 生物化学
- `cell.json` - 细胞生物学
- `clinical.json` - 临床基础检验
- `law.json` - 医事法学
- `med_bio.json` - 临床生物化学

每个题库文件包含题目 ID、题干、选项、答案、类型等信息。

### 题目类型

- **single_choice** - 单选题
- **multiple_choice** - 多选题
- **true_false** - 判断题
- **matching** - 匹配题

### 添加新题库

1. 在 `lib/` 目录下创建新的 JSON 文件
2. 按照现有题库的格式添加题目数据
3. 在 `lib/question-data.ts` 中添加新科目的配置
4. 重新构建应用

## 开发指南

### 代码规范

项目使用 ESLint 进行代码检查：

```bash
pnpm lint
```

### 添加新功能

1. 在相应的目录下创建新文件或修改现有文件
2. 遵循项目的代码风格和组件结构
3. 确保类型安全，充分利用 TypeScript
4. 测试功能是否正常工作
5. 提交代码前运行 lint 检查

### 调试技巧

- 使用 React DevTools 查看组件状态
- 使用浏览器控制台查看日志
- 使用 Network 面板检查 API 请求
- 检查 LocalStorage 中的数据

## 部署

### Vercel 部署（推荐）

1. Fork 本项目到你的 GitHub 账号
2. 在 [Vercel](https://vercel.com) 创建新项目
3. 导入你的 GitHub 仓库
4. 配置环境变量
5. 点击部署

### 自托管部署

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

使用 PM2 或其他进程管理工具保持应用运行：

```bash
pm2 start npm --name "marix-yi" -- start
```

## 常见问题

### 如何清除本地数据？

打开浏览器控制台，执行以下命令：

```javascript
localStorage.clear()
```

### AI 解析功能无法使用？

1. 检查是否配置了 `DEEPSEEK_API_KEY` 环境变量
2. 检查 API 密钥是否有效
3. 检查是否超过每日使用次数限制（30次）

### 评论功能无法使用？

1. 检查数据库连接是否正常
2. 检查是否执行了数据库初始化脚本
3. 检查数据库配置是否正确

### 题库数据如何更新？

直接修改 `lib/` 目录下的 JSON 文件，然后重新构建应用。

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 Issue

- 描述问题或建议
- 提供复现步骤（如果是 Bug）
- 附上相关截图或日志

### 提交 Pull Request

1. Fork 本项目
2. 创建新的分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m 'Add some feature'`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 创建 Pull Request

## 开源协议

本项目采用 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

## 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [shadcn/ui](https://ui.shadcn.com/) - 优秀的 UI 组件库
- [Radix UI](https://www.radix-ui.com/) - 无头 UI 组件
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [DeepSeek AI](https://www.deepseek.com/) - AI 模型支持

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- GitHub Issues: [https://github.com/coaixy/marix-yi/issues](https://github.com/coaixy/marix-yi/issues)
- Email: your-email@example.com

---

<div align="center">
Made with ❤️ by coaixy
</div>
