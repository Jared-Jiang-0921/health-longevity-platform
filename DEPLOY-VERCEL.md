# 使用 Vercel 部署 Health Longevity Platform — 手把手教程

按顺序完成下面每一步即可把网站部署到公网。

---

## 第一步：安装 Node.js（若未安装）

1. 打开浏览器，访问：https://nodejs.org  
2. 下载并安装 **LTS** 版本（绿色按钮）。  
3. 安装完成后，打开终端，输入：
   ```bash
   node -v
   npm -v
   ```
   若能看到版本号，说明安装成功。

---

## 第二步：确认项目能本地构建成功

1. 在终端进入项目目录：
   ```bash
   cd "/Users/fsjy_/Desktop/原电脑资料/ai学习/health-longevity-platform"
   ```
2. 安装依赖并构建：
   ```bash
   npm install
   npm run build
   ```
3. 若没有报错，且生成了 `dist` 文件夹，说明可以部署。  
   若有报错，先解决报错再继续。

---

## 第三步：注册 / 登录 GitHub

1. 打开：https://github.com  
2. 若没有账号，点击 **Sign up** 注册；若有账号，点击 **Sign in** 登录。  
3. 登录后进入自己的主页（能看到自己的头像和仓库列表即可）。

---

## 第四步：在电脑上安装 Git（若未安装）

1. 打开：https://git-scm.com/downloads  
2. 下载并安装对应系统的 Git。  
3. 安装后打开终端，输入：
   ```bash
   git --version
   ```
   能看到版本号即可。

---

## 第五步：把项目推送到 GitHub

1. 在终端进入项目目录：
   ```bash
   cd "/Users/fsjy_/Desktop/原电脑资料/ai学习/health-longevity-platform"
   ```
2. 初始化 Git 仓库（若尚未初始化）：
   ```bash
   git init
   ```
3. 添加所有文件并提交：
   ```bash
   git add .
   git commit -m "准备部署到 Vercel"
   ```
   （若提示需要配置 user.name / user.email，按提示先配置再执行上面两条。）

4. 在 GitHub 网页上新建仓库：  
   - 点击右上角 **+** → **New repository**  
   - **Repository name** 填：`health-longevity-platform`（或任意英文名）  
   - 选择 **Public**，不要勾选 “Add a README”（仓库保持空）  
   - 点击 **Create repository**

5. 把本地仓库推送到 GitHub（把 `你的用户名` 换成你的 GitHub 用户名）：
   ```bash
   git remote add origin https://github.com/你的用户名/health-longevity-platform.git
   git branch -M main
   git push -u origin main
   ```
   若提示输入账号密码，请使用 **Personal Access Token** 作为密码（在 GitHub → Settings → Developer settings → Personal access tokens 里生成）。

6. 刷新 GitHub 仓库页面，应能看到项目里的文件（如 `package.json`、`src` 等）。

---

## 第六步：用 Vercel 部署

1. 打开：https://vercel.com  
2. 点击 **Sign Up** 或 **Log In**，选择 **Continue with GitHub**，按提示授权 Vercel 访问你的 GitHub。

3. 登录后，点击 **Add New…** → **Project**。

4. 在 **Import Git Repository** 里找到 `health-longevity-platform`（或你起的仓库名），点击 **Import**。

5. **Configure Project** 页面：
   - **Project Name**：可保持默认或改成 `health-longevity-platform`。  
   - **Root Directory**：保持默认（不要改）。  
   - **Framework Preset**：应自动识别为 **Vite**，不用改。  
   - **Build Command**：留空或填 `npm run build`。  
   - **Output Directory**：留空或填 `dist`。  
   - **Install Command**：留空（默认 `npm install`）。

6. **Environment Variables（环境变量）**（可选，按需添加）：  
   点击 **Environment Variables**，逐个添加（若暂时不用支付和 Coze，可先不填）：
   - **Name**：`VITE_STRIPE_PUBLISHABLE_KEY`  
     **Value**：你的 Stripe 公钥（如 `pk_test_xxx`）  
   - **Name**：`VITE_COZE_PROXY`  
     **Value**：你的 Coze 代理地址（例如 `https://你的后端.railway.app`，若暂无可先不填）  
   - **Name**：`VITE_PAYMENT_INTENT_API`  
     **Value**：支付接口地址（若暂无可先不填）

7. 点击 **Deploy**，等待 1～2 分钟。

8. 部署完成后会显示 **Congratulations!** 和一个网址，形如：  
   `https://health-longevity-platform-xxx.vercel.app`  
   点击该链接即可在浏览器中打开你部署好的网站。

---

## 第七步：之后如何更新网站

每次改完代码，在项目目录执行：

```bash
git add .
git commit -m "更新说明"
git push
```

Vercel 会自动检测到 GitHub 的更新并重新构建、部署，几分钟后访问同一网址即可看到最新内容。

---

## 常见问题

**Q：点击链接后页面空白？**  
A：多半是路由问题。确认项目根目录下有 `vercel.json`，且内容包含 `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`。本仓库已包含该配置。

**Q：部署成功但图片/接口请求失败？**  
A：检查环境变量是否在 Vercel 里正确填写（如 `VITE_COZE_PROXY`、`VITE_PAYMENT_INTENT_API`），且后端服务已部署并可公网访问。

**Q：想用自己域名？**  
A：在 Vercel 项目里进入 **Settings → Domains**，按提示添加域名并解析即可。

---

按以上步骤做完，你的 Health Longevity Platform 就已经在 Vercel 上运行了。
