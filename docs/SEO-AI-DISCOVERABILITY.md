# 搜索引擎与 AI 可发现性

公开营销页和说明页允许抓取。账户、支付、问卷答案、评估结果、咨询对话、课程学习页、后台和 `/api` 不允许。

规范站点是 `https://www.healthlongevity.cn/`。当前公开部署 `https://healthlongevityplatform.vercel.app/` 提供同一套内容。sitemap 里的网址使用规范站点，避免两套重复收录。关于页写明两个地址。

本站内容只供健康教育与生活方式参考，不替代诊疗、处方或紧急医疗处置。提交收录时不要把页面句子改成诊断或疗效承诺。

## 2026-11-10 线上核对后补上的

核对的是当时已上线的 `https://www.healthlongevity.cn`（首页约 8.7KB，资讯页约 134KB，均为预渲染 HTML）：

- 首页、关于、方案、资讯栏目返回 200，canonical 指向 `www`，正文在 HTML 里，不依赖执行 JavaScript。
- sitemap 有 17 个栏目网址，`lastmod` 全是 `2026-11-08`，也就是那次部署的日期，不是各页内容真正改过的日期。
- 资讯页有 144 条卡片（标题可检索），但没有单独网址；证据约定「请勿将单篇前沿研究……理解为已在人体证实有效」不在这份 HTML 里，只在打开页面后的脚本中。
- 访问一个不存在的 `/longevity-news/某id` 会落到首页 HTML。公开网页搜索能看到首页、产品、治未病、资讯栏目和注册页。当时还没有单篇网址，所以搜不到单篇不等于「百度已拒绝收录」。

这次只补了这三处：

- 已经写了摘要或阅读要点的资讯才有稳定网址 `/longevity-news/<id>`，并写进 sitemap。只有标题和关键词的卡片仍留在栏目页，不另做空页面。
- sitemap 的栏目日期固定为内容日期 `2026-11-07`；资讯栏目用条目日期和说明补上的 `2026-11-10` 里较新的一天；单篇用条目自己的日期。不再把每次构建当天写进全部 URL。
- 资讯栏目和单篇 HTML 都放上站内原有的证据约定。单篇 JSON-LD 只有标题、摘要、已有日期和来源链接，不编造作者、审稿人或医疗机构背书。

`llms.txt` 仍只是给程序读的目录，并写明它不是百度或其它搜索引擎的收录或排名承诺。

部署仍是：`deploy-ecs.sh` 先构建前端，再等 API 和资讯接口就绪，然后预渲染。Vercel 仍是一个 API 函数加 `/((?!api/).*)` 回退；单篇 HTML 作为静态文件优先提供。本机没有资讯接口时，预渲染只会带上 5 篇静态稿；线上 ECS 部署才会把数据库里有摘要的条目一并写成单篇。

回归检查：

```bash
npm run seo:check
npm run build
```

## 公开文件

| 路径 | 作用 |
| --- | --- |
| `/robots.txt` | 允许公开页；拦截账户、支付、接口、后台和需登录的深层路径 |
| `/sitemap.xml` | 上述栏目页，以及已有摘要或阅读要点的资讯单篇。栏目 `lastmod` 用内容日期，单篇用条目自己的日期 |
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
3. 左侧「站点地图」提交：`https://www.healthlongevity.cn/sitemap.xml`。这次改动上线后需要再提交一次，否则单篇网址不会出现在你已经交过的那份旧地图里。
4. 用「网址检查」查看 `https://www.healthlongevity.cn/`、`/about` 和 `/solutions`。可索引的页面应是「网址在 Google 上」，抓取结果里能看到标题和说明。
5. 若还要把 Vercel 网址当成单独资源，只验证 `https://healthlongevityplatform.vercel.app/` 即可。sitemap 条目指向规范域名，索引以 `www.healthlongevity.cn` 为准，避免两个主机各收一套重复页。

## 百度站长平台

1. 打开 [百度搜索资源平台](https://ziyuan.baidu.com/)，添加站点 `https://www.healthlongevity.cn/`。
2. 按提示完成验证（HTML 文件、CNAME 或文件验证）。验证文件同样不要被 Disallow 挡住。
3. 在「普通收录 → 资源提交 → sitemap」填写 `https://www.healthlongevity.cn/sitemap.xml`。站点验证和提交都要站长账号操作，本仓库不能代为完成。上线后再提交一次，让单篇网址进入新地图。
4. 提交后看抓取诊断。若百度仍抓到旧的登录墙页面，对 `/about` 使用「手动提交」一次，方便它先读到纯文本说明。
5. 不要提交 `/api/`、账户、支付、问卷或咨询对话。这些路径已在 `robots.txt` 中禁止。

索引有延迟，提交成功只说明平台收到了 sitemap，不表示当天就会出现在搜索结果里。
