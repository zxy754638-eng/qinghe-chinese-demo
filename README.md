# 青禾中文 Qinghe Chinese

面向已经掌握拼音、具有一定中文基础的外国学习者，依据 HSK 3.0（2025 大纲）整理的中文学习 Web App Demo。

在线预览：[qinghe-chinese-demo.zxy794393457.chatgpt.site](https://qinghe-chinese-demo.zxy794393457.chatgpt.site/)

## 功能

- HSK 1–6 共 60 门原创场景课，每课标注 HSK 3.0 话题路径、能力任务、技能范围和审校状态
- 大纲概览展示 HSK 1–6 官方累计词汇目标（300 / 500 / 1,000 / 2,000 / 3,600 / 5,400）；当前课程是结构化 Demo，不代表已经覆盖全部大纲词汇
- HSK 1 拼音学习区，以及 32 组主题词库；中文、带调拼音、英文对照，并接入间隔复习
- 320 条主题词例句均含独立英文翻译、整句朗读入口，并支持悬停例句词语查看拼音、点击打开词卡
- 中文/英文操作界面一键切换，学习内容保持中文
- 词语悬停或点击查看拼音与英文释义
- 词典支持汉字、繁体字、带调拼音、数字声调和英文释义反向检索
- 完整 CC-CEDICT 已打包为同源静态资源，首次加载后可离线查询
- 本地生词本、学习进度、间隔复习和学习统计
- 标准普通话发音入口及跟读交互原型
- PWA 离线缓存与移动端适配
- Authing 登录入口

## 本地预览

在项目目录运行：

```powershell
python -m http.server 8765 --directory dist
```

然后访问 <http://localhost:8765/>。

## GitHub Pages

仓库包含 `.github/workflows/pages.yml`。推送到 `main` 后，GitHub Actions 会自动将 `dist` 发布到 GitHub Pages。

首次使用时，在 GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。

## 开放数据说明

词典基础数据参考 CC-CEDICT（CC BY-SA 4.0）与 Unicode Unihan。中文学习释义、HSK 标签、搭配与例句为青禾中文原创或单独审校内容。完整 CC-CEDICT 位于 `dist/data/cedict.min.json`，详细署名与许可证链接见应用词典页及 `dist/licenses/CC-CEDICT-NOTICE.txt`。

使用新的官方 CC-CEDICT GZip 数据更新本地词典：

```powershell
node scripts/update-cedict.mjs --input path/to/cedict.txt.gz
```

## HSK 3.0 内容审校

等级目标和累计词汇量以《新版 HSK 考试大纲（2025）》为依据；青禾的课程顺序、对话、释义、例句和练习均为原创教学内容，并非官方教材。第一轮自动检查：

```powershell
node scripts/audit-hsk30-content.mjs
```

报告会写入 `dist/data/hsk30-review-report.json`。自动检查用于发现缺字段、漏词条、数字声调等结构问题；语言自然度、等级难度、语用和文化内容仍需人工逐课审校。
