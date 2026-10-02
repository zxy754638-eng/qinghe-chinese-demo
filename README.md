# 青禾中文 Qinghe Chinese

面向已经掌握拼音、具有一定中文基础的外国学习者的 HSK 中文学习 Web App Demo。

在线预览：[qinghe-chinese-demo.zxy794393457.chatgpt.site](https://qinghe-chinese-demo.zxy794393457.chatgpt.site/)

## 功能

- HSK 1–6 场景课程与 HSK 1 拼音学习区
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
