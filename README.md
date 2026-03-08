# Health Longevity Platform

健康长寿平台：高级健康技能学习、数字化健康长寿解决方案、优质健康产品推荐、在线全球化支付结算（Stripe）与税费缴纳。

## 技术栈

- **前端**：React 18 + Vite 5 + React Router 6
- **支付**：Stripe（@stripe/stripe-js + @stripe/react-stripe-js）
- **样式**：CSS 变量 + 模块化 CSS

## 本地运行

### 1. 安装 Node.js

若未安装，请从 [nodejs.org](https://nodejs.org/) 安装 LTS 版本（会同时安装 npm）。

### 2. 安装依赖并启动前端

```bash
cd health-longevity-platform
npm install
npm run dev
```

浏览器访问：http://localhost:5173

### 3. 配置 Stripe（真实支付）

1. 在 [Stripe Dashboard](https://dashboard.stripe.com/apikeys) 获取 **Publishable key**（测试用 `pk_test_` 开头）。
2. 在项目根目录复制环境变量示例并填写公钥：
   ```bash
   cp .env.example .env
   # 编辑 .env，设置 VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   ```
3. **后端创建 PaymentIntent**（Stripe 要求由服务端创建）：
   - 在 [Stripe Dashboard](https://dashboard.stripe.com/apikeys) 获取 **Secret key**（`sk_test_`），**切勿**放入前端代码。
   - 使用本仓库提供的示例后端：
     ```bash
     cd server
     npm install
     STRIPE_SECRET_KEY=sk_test_xxx node create-payment-intent.js
     ```
   - 前端需能请求到该接口。若后端运行在 `http://localhost:4242`，在 `.env` 中增加：
     ```
     VITE_PAYMENT_INTENT_API=http://localhost:4242/create-payment-intent
     ```
   - 重新执行 `npm run dev` 后，打开「支付结算」页即可看到 Stripe 支付表单并完成测试支付。

### 4. 配置 Coze 智能体（健康长寿方案）

1. 在 [Coze 开放平台](https://www.coze.cn) 获取 **PAT（个人访问令牌）** 和 **Bot ID**。
2. 启动 Coze 代理服务（需在 server 目录）：
   ```bash
   cd server
   npm install
   COZE_API_KEY=pat_xxx COZE_BOT_ID=xxx npm run coze
   ```
   - 默认端口 4243。国际版请设置 `COZE_BASE=https://api.coze.com`。
3. 在项目根目录 `.env` 中配置：
   ```
   VITE_COZE_PROXY=http://localhost:4243
   ```
4. 可选：转人工入口地址 `VITE_HUMAN_CONTACT_URL=mailto:support@your-domain.com`（或客服链接）。
5. 重新运行前端，打开「健康长寿方案」即可与 Coze 智能体对话，极端情况可点击「转人工」。

## 项目结构

```
health-longevity-platform/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Layout.jsx / Layout.css
│   │   └── PaymentForm.jsx
│   └── pages/
│       ├── Home.jsx / Home.css
│       ├── HealthSkills.jsx
│       ├── Solutions.jsx
│       ├── Products.jsx
│       ├── Payment.jsx
│       ├── PaymentSuccess.jsx
│       └── Tax.jsx
└── server/                 # 可选后端
    ├── package.json
    ├── create-payment-intent.js   # Stripe PaymentIntent
    └── coze-chat.js               # Coze 智能体 API 代理
```

## 后续可扩展

- **健康技能学习**：课程列表、详情、视频/文档展示
- **健康长寿方案**：Coze 智能体 API 对话，支持转人工
- **健康产品**：商品列表、详情、加入购物车后跳转支付
- **税费缴纳**：按国家/地区计算税费说明或接入税务 API
- **后端**：用户登录、订单与支付记录、Webhook 处理 Stripe 事件

## 构建与部署

```bash
npm run build
npm run preview   # 本地预览构建结果
```

将 `dist/` 部署到任意静态托管；支付相关接口需单独部署后端并配置 `VITE_PAYMENT_INTENT_API`。

---

## 部署（上线）

### 方式一：Vercel（推荐，免费）

1. 将代码推送到 GitHub（若尚未）。
2. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录。
3. 点击 **Add New → Project**，导入本仓库。
4. **Root Directory** 保持为仓库根目录（即 `health-longevity-platform` 所在目录）。
5. **Build Command** 留空或填 `npm run build`，**Output Directory** 填 `dist`（Vercel 检测到 Vite 会自动填）。
6. 在 **Environment Variables** 中配置（与本地 .env 对应）：
   - `VITE_STRIPE_PUBLISHABLE_KEY`（若使用支付）
   - `VITE_COZE_PROXY`（若使用 Coze，填你部署的后端地址）
   - `VITE_PAYMENT_INTENT_API`（若支付后端单独部署，填该 API 地址）
   - `VITE_HUMAN_CONTACT_URL`（可选）
7. 点击 **Deploy**，完成后会得到 `https://xxx.vercel.app`。

**说明**：项目内已包含 `vercel.json`，所有路由（如 `/health-skills`、`/products`）会正确指向 `index.html`，刷新不 404。

### 方式二：Netlify

1. 将代码推送到 GitHub。
2. 打开 [netlify.com](https://www.netlify.com)，用 GitHub 登录。
3. **Add new site → Import an existing project**，选择本仓库。
4. **Build command**：`npm run build`，**Publish directory**：`dist`。
5. 在 **Site settings → Environment variables** 中添加上述 `VITE_*` 变量。
6. 部署后可在 **Domain management** 绑定自定义域名。

**说明**：项目内已包含 `netlify.toml`，SPA 路由已配置。

### 后端（支付 / Coze）部署

- **Stripe PaymentIntent**（`server/create-payment-intent.js`）与 **Coze 代理**（`server/coze-chat.js`）需单独部署到支持 Node 的环境，例如：
  - **Vercel Serverless**：将 `server` 下接口拆成 API Routes 部署。
  - **Railway / Render / 自建 VPS**：在服务器上运行 `node create-payment-intent.js` 或 `node coze-chat.js`，并配置环境变量。
- 部署后把后端地址填回前端的 `VITE_PAYMENT_INTENT_API`、`VITE_COZE_PROXY`，重新部署前端或重新构建即可生效。
