# 部署到阿里云 OSS 静态托管
# 用法: npm run deploy
# 流程: next build 出静态产物 out/ → ossutil 增量同步到 OSS bucket(--delete 镜像,删除线上多余文件)
# 前置: 已装 ossutil 且 ~/.ossutilconfig 配好 endpoint + 密钥

$ErrorActionPreference = 'Stop'

# 切到仓库根目录(本脚本位于 scripts/ 下),保证相对路径稳定
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

$Bucket = 'oss://funkandlove-index/'

Write-Host '==> [1/2] 构建静态产物 (next build)...' -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw "构建失败 (exit $LASTEXITCODE),已中止部署" }

if (-not (Test-Path 'out')) { throw "未找到 out/ 目录,构建可能未产出静态文件" }

Write-Host "==> [2/2] 同步 out/ 到 $Bucket (增量 + 删除多余)..." -ForegroundColor Cyan
ossutil sync out/ $Bucket --delete --update -f
if ($LASTEXITCODE -ne 0) { throw "OSS 同步失败 (exit $LASTEXITCODE)" }

Write-Host '==> 部署完成 ✅' -ForegroundColor Green
