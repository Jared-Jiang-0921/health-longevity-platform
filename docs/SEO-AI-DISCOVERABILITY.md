# 搜索引擎与 AI 可发现性

公开营销页和说明页允许抓取。账户、支付、问卷答案、评估结果、咨询对话、课程学习页、后台和 `/api` 不允许。

规范站点是 `https://www.healthlongevity.cn/`。当前公开部署 `https://healthlongevityplatform.vercel.app/` 提供同一套内容。sitemap 里的网址使用规范站点，避免两套重复收录。关于页写明两个地址。

本站内容只供健康教育与生活方式参考，不替代诊疗、处方或紧急医疗处置。提交收录时不要把页面句子改成诊断或疗效承诺。

## 公开文件

| 路径 | 作用 |
| --- | --- |
| `/robots.txt` | 允许公开页；拦截账户、支付、接口、后台和需登录的深层路径 |
| `/sitemap.xml` | 首页、关于、方案、知识技能入口、产品、治未病、资讯、转化机会、登录注册和法律页；含中英阿 hreflang |
| `/llms.txt` | 给 Doubao、DeepSeek、ChatGPT 等系统的纯文本摘要，与关于页同一套事实 |
| `/about` | 平台是什么、面向谁、模块、咨询概览、合规声明、网址和最近更新 |

构建命令 `npm run build` 会预渲染上述公开页的标题、说明、Open Graph、Twitter 和 JSON-LD，并把正文放进 HTML，不执行 JavaScript 的抓取器也能读到。`npm run dev` 下这些地址同样可直接查看。

Vercel 先提供 `dist` 里的静态文件（包括 `about/index.html`、`robots.txt`、`sitemap.xml`、`llms.txt`），找不到时再用 `/((?!api/).*)` 回到首页。不要把这条回退写成带多个排除项的正则，当前 path-to-regexp 会判为非法路由。自建 Nginx 已用 `try_files` 找到预渲染页。Netlify 仍在 `netlify.toml` 里把公开路径指到对应的 `index.html`。新增要收录的公开路由时，把它放进 `src/data/seo.js` 的 `SEO_PAGES`，并在 `netlify.toml` 加上同样的路径映射。

不收录：`/account`、`/payment`、`/ops/`、`/org`、`/favorites`、`/health-questionnaire`、`/solutions/risk`、`/solutions/aging`、`/tcm-prevention/constitution`、`/health-skills/` 下的课程页、`/api/`、`/mcp`、`/.well-known/`。

## 本地核对

```bash
npm run dev
```

另开一个终端：

```bash
curl -sS http://localhost:5173/robots.txt
curl -sS http://localhost:5173/sitemap.xml
curl -sS http://localhost:5173/ | tr '\n' ' ' | grep -o '<title>[^<]*</title>'
curl -sS http://localhost:5173/solutions | tr '\n' ' ' | grep -o '<title>[^<]*</title>'
curl -sS http://localhost:5173/about | tr '\n' ' ' | grep -o '<title>[^<]*</title>'
```

浏览器对首页、`/solutions`、`/about` 使用「查看网页源代码」（不要只看开发者工具里脚本改过的 DOM），确认有：

- `<title>` 与 `meta name="description"`
- `og:title`、`og:description`、`twitter:card`
- `application/ld+json`：首页含 `Organization` 与 `WebSite`；关于页和方案页另含 `FAQPage`
- 关于页正文里能直接看到平台说明、咨询界限、免责声明、规范网址和最近更新日期

构建后再看产物：

```bash
npm run build
test -f dist/robots.txt && test -f dist/sitemap.xml && test -f dist/about/index.html
```

## Google Search Console

1. 打开 [Google Search Console](https://search.google.com/search-console)，添加资源。规范域名用「网域」资源 `healthlongevity.cn`，或网址前缀 `https://www.healthlongevity.cn/`。
2. 按页面提示完成 DNS 或 HTML 文件验证。验证文件放在站点根目录，不要写进 `robots.txt` 的 Disallow。
3. 左侧「站点地图」提交：`https://www.healthlongevity.cn/sitemap.xml`。
4. 用「网址检查」查看 `https://www.healthlongevity.cn/`、`/about` 和 `/solutions`。可索引的页面应是「网址在 Google 上」，抓取结果里能看到标题和说明。
5. 若还要把 Vercel 网址当成单独资源，只验证 `https://healthlongevityplatform.vercel.app/` 即可。sitemap 条目指向规范域名，索引以 `www.healthlongevity.cn` 为准，避免两个主机各收一套重复页。

## 百度站长平台

1. 打开 [百度搜索资源平台](https://ziyuan.baidu.com/)，添加站点 `https://www.healthlongevity.cn/`。
2. 按提示完成验证（HTML 文件、CNAME 或文件验证）。验证文件同样不要被 Disallow 挡住。
3. 在「普通收录 → 资源提交 → sitemap」填写 `https://www.healthlongevity.cn/sitemap.xml`。
4. 提交后看抓取诊断。若百度仍抓到旧的登录墙页面，对 `/about` 使用「手动提交」一次，方便它先读到纯文本说明。
5. 不要提交 `/api/`、账户、支付、问卷或咨询对话。这些路径已在 `robots.txt` 中禁止。

索引有延迟，提交成功只说明平台收到了 sitemap，不表示当天就会出现在搜索结果里。
