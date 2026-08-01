# GitHub 开源高考数据源调研报告

> 调研时间：2026-08-01。目标：为「笔袋复刻」App 找到免费、开源、可复刻的高考数据。

## 一、已收录的核心开源数据源（已下载到本仓库 databases/ 目录）

### 1. `EvanYao826/china-university-admission` ★10
**描述**：一站式查询全国高校历年高考、研究生招生分数线、录取人数，支持离线，数据打包在 SQLite。
**收录文件**：
- `databases/gaokao.db`（2.7MB，SQLite）
  - `universities` 表：**1167 所**高校（id/name/type/level/province/city/tags/logo/description/website）
  - `undergraduate_admissions` 表：**6392 条**高考录取记录（2023-2025年，按 省份/科类组/批次，含 min_score/min_rank）
  - `postgraduate_admissions` 表：12 条 2025 考研复试线样例
- `databases/universities.json`（1167 所，结构化导出）
- `databases/admissions.json`（6392 条，结构化导出）

**特点**：多省份覆盖（含福建284条）、院校信息最全、位次填充率95.6%。
**局限**：录取数据仅覆盖 43 所高校；major 字段为空（组级粒度，非专业级）。

### 2. `sbnuc/volunteer-henan` ★4
**描述**：河南高考志愿填报系统，全国高校近三年完整录取分数线、位次数据库，融合 MBTI/霍兰德/大五/DISC 人格测评推荐。
**收录文件**：
- `databases/henan_major_scores.json`（4.9MB，**专业级**录取数据）
  - **2349 所**高校（985:50 / 211:80 / 双一流:30 / 本科:1191 / 专科:998）
  - **30,575 条专业录取记录**，每条含：
    - 专业名称（majors[].name）
    - 2023-2025 三年专业分数线（scores）
    - 2023-2025 三年专业位次（ranking）
    - 选科要求（subjectReq，如"不限"）
- 附：人格测评（MBTI等）数据源（笔袋"生涯规划"功能可复用）

**特点**：专业级粒度（同类数据中最丰富）、含选科要求、三年位次齐全。
**局限**：是**河南考生**视角数据（河南物理/历史类分数线体系）。此处浙大河南分数（655/634/644）与福建不同属正常。

### 3. `scottli139/beijing-gaokao-score-segments` ★1
**描述**：北京高考一分一段表（2023-2025）。
**收录文件**：`databases/beijing_score_segments.json`（101KB）
- 2023/2024/2025 三年北京各分数段人数（count）与累计位次（cumulative）

**用途**：分数→位次换算的关键数据（目前仅北京，可扩展其他省）。

## 二、数据源评估矩阵（用于选型）

| 数据源 | 院校覆盖 | 分数粒度 | 位次 | 年份 | 省份 | License |
|--------|---------|---------|------|------|------|---------|
| china-university-admission | 1167所 | 校+组 | ✅95% | 2023-25 | 全国(含福建284) | MIT |
| volunteer-henan | 2349所 | **专业级** | ✅ | 2023-25 | 河南 | 开源 |
| beijing-gaokao-score-segments | 北京一分一段 | 分数段 | ✅ | 2023-25 | 北京 | 开源 |

## 三、其余有价值开源项目（可扩展数据）

| 仓库 | 说明 | 建议 |
|------|------|------|
| `siu91/easy_university_selection` ★52 | 全国高校历年各省录取分数线爬虫 | 可扩展 dataset |
| `labolado/gaokao_2016-2020` ★33 | 2016-2020 全国分数线汇总 | 历史数据补充 |
| `lyscf/gaokao-analytics` ★20 | python爬虫爬取分数线/招生计划 | 爬虫扩展 |
| `Rafael-Luo/spider-college` ★14 | 全国高校基本信息+录取分数爬虫 | 爬虫扩展 |
| `Irwin-hu/GaoKao_University_inquiry` | 各省分数线/专业分数/招生计划/一分一段查询 | 全功能参考 |
| `shenxiu666` 江西志愿规划 | 一分一段折算等效分+冲稳保 | 算法参考 |
| `slok2024/yifen` | 山东一分一段跨年双向换算 | 换算算法 |

## 四、数据合规与使用说明
- 开源数据遵循各仓库 License（以仓库 LICENSE 为准），数据多来源于公开渠道（EOL阳光高考、各省考试院、教育部），本应用属学习研究用途。
- **免责**：所有数据仅供研究参考，实际填报请以当年官方发布及考生所在省考试院为准。
- 分数线为年度动态数据，建议 App 内置近2-3年 + 支持"导入API/联网更新"。

## 五、与手写权威数据的互补
本仓库 `data/gaokao/`、`data/universities/`、`data/majors/` 下的 Markdown 为人工整理的权威稳定数据（各省高考制度、985/211/双一流名单、专业目录、录取批次规则），与上述开源数据库互为补充，共同构成 App 数据层。
