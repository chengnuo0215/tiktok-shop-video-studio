# TikTok Shop Video Studio

一个用于演示 AI 视频改片流程的高保真网页原型。用户可以观看示例视频、按整片或分镜提交感受、确认修改计划、生成候选版本，并继续迭代或预览导出结果。

## 在线体验

https://tiktok-shop-video-studio.vercel.app/#home

推荐从首页的 **Lightweight Sunscreen Review** 项目开始体验完整流程。

## 主要流程

1. **Share Feedback**：观看视频，按 Whole Video 或各个 Shot 选择与补充反馈。
2. **Plan Changes**：逐项选择修改方向，并编辑或删除计划内容。
3. **Generate Videos**：查看三个候选版本，选择后进入详情、继续迭代或模拟导出。

页面还包含项目版本管理、分镜跳转、视频播放控制、响应式布局、页面状态恢复，以及步骤跳转时的加载反馈。当前为交互演示原型，不包含真实 AI 生成后端。

## 页面入口

- `#home`：项目首页
- `#new-project`：新建项目弹窗
- `#feedback`：反馈收集
- `#plan`：修改计划
- `#candidates`：候选视频
- `#preview`：候选详情

## 本地运行

需要 Node.js 18 或更高版本。

```bash
npm install
npm run build
npm start
```

然后打开 http://localhost:4190 。

## 项目结构

- `prototype.js`：页面状态、视频控制和交互逻辑
- `prototype.css`：响应式布局与交互样式
- `screens/`：构建生成的六个静态页面
- `source/`：页面结构与几何数据
- `assets/`：图标、字体、图片和示例视频
- `build.cjs`：静态页面与样式构建脚本
- `verify.cjs`：主要流程验证脚本
- `vercel.json`：Vercel 部署配置

## 部署

项目已配置 Vercel。连接 GitHub 仓库后，可使用默认构建命令直接部署。
