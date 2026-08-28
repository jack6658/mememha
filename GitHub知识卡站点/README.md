﻿﻿﻿# 生物知识卡 · GitHub Pages 站点

单卡片独立 HTML 的多文件站点：一个欢迎入口 + 一个搜索页 + 无数独立知识卡。适合持续添加大量知识卡。

## 文件夹结构

```
站点文件夹
├── index.html      欢迎入口（烟花动画首页，点"✦ 进入 ✦"直接进入功能选择页）
├── list.html       功能选择页（仅"返回欢迎入口"和"搜索卡片"两个按钮）
├── search.html     搜索页（输入卡片 ID 精确搜索，附 ID 对照清单）
├── cards.json      卡片索引（脚本自动生成）
├── build_index.js  本地索引生成脚本（Node.js，无需上传）
├── README.md       本说明
├── 替换/            本次需要上传的文件（每次加卡后自动刷新，内容按目录结构与仓库根目录一致）
└── cards/          知识卡 HTML 全部放这里（每张卡一个文件）
    ├── 细胞工厂_分子与细胞_知识卡片.html
    ├── 能量中枢_酶与代谢_知识卡片.html
    └── ...（以后加卡就往这里放）
```

## 首次上传（按顺序分 3 次提交）

### 第 1 步：创建 GitHub 仓库并开启 Pages
1. 打开 https://github.com ，登录后点右上角 **+ → New repository**。
2. 仓库名填任意名字（如 `biology-cards`），选 **Public**（公开，免费托管必需），**不要勾选** "Add a README"（避免冲突），点 Create repository。
3. 进入仓库后：**Settings → Pages** → 在 "Branch" 下选 `main` → 点 Save（或直接选 Deploy from a branch）。

### 第 2 步：上传"欢迎入口"
上传 `index.html`（方式见下方"上传方式"），此时页面已可访问（URL 见第 5 步）。

### 第 3 步：上传"功能选择页 + 搜索页"
再上传 `list.html`、`search.html` 和 `cards.json`。

> 搜索说明：输入**完整卡片 ID**（纯数字，如 1、2、3…）才能搜到对应卡片；只输一个数字如 `1` 只会精确匹配 ID=1 的卡，不会模糊匹配出一堆。ID 清单可在搜索页展开"📋 查看卡片 ID 清单"查看。

### 第 4 步：上传知识卡
把 `cards/` 文件夹整个上传（或单独拖入每个 HTML）。

### 第 5 步：访问你的站点
URL 格式：`https://你的用户名.github.io/仓库名/`
（例如用户名 `zhangsan`、仓库 `biology-cards` → `https://zhangsan.github.io/biology-cards/`）
上传后等待 1-2 分钟生效。

## 上传方式（任选其一）

### 方式 A：GitHub Desktop（推荐，图形界面）
1. 下载安装 https://desktop.github.com ，登录 GitHub。
2. File → New repository... 或 Clone 你刚建的仓库到电脑。
3. 把站点文件夹里的 `index.html`、`search.html`、`cards.json`、`cards/` 文件夹复制进本地仓库文件夹。
4. 打开 GitHub Desktop，左边看到改动 → 写个提交说明（如 "add index"）→ **Commit to main** → 点 **Push origin**。
5. 以后加新卡：把 HTML 放进本地仓库的 `cards/` → 运行 `node build_index.js` → Commit → Push。

### 方式 B：git 命令行
```bash
cd 你的本地仓库文件夹
git add index.html
git commit -m "add welcome page"
git push

# 之后分步添加
git add list.html search.html cards.json && git commit -m "add choices & search" && git push
git add cards/ && git commit -m "add knowledge cards" && git push
```

### 方式 C：网页直接上传（少量文件时方便）
在仓库页面点 **Add file → Upload files**，把文件拖进上传框 → 写提交说明 → Commit changes。多个文件可一次全选上传。

## 以后添加新知识卡（核心维护流程）
1. 把新的 HTML 知识卡放进 `cards/` 文件夹。
2. 在站点文件夹运行 `node build_index.js`（会自动更新索引、搜索页、ID 对照表）。
3. **检查 `替换/` 文件夹**：里面已自动放入本次需要上传的文件（保持与仓库根目录一致的目录结构）。
4. 把 `替换/` 文件夹内的内容按目录结构上传覆盖到仓库即可（其他文件不用动）。

> 只需记住：**加卡 → 跑脚本 → 上传「替换」**，三步即可。
> 「替换」文件夹每次只保留本次要传的文件——看到它内容变了，就知道有新版要传了。

## 本地预览
浏览器直接双击 `index.html` 即可预览（数据内嵌在页面里，不需要服务器）。

## 注意事项
- 仓库必须是 **Public**，Private 仓库开启 Pages 需付费。
- 每张卡都是独立 HTML，互不影响，删卡只需删文件并重跑脚本。
- 文件名尽量用中文或无空格（GitHub 支持中文文件名）。
- 若卡片很多，搜索页依然流畅（搜索的是索引，不下载卡片正文）。
