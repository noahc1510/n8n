# 0.0 全局安装node环境，使用nvm进行node版本管理
# 0.1 安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 0.2 重启终端

# 0.3 安装node最新LTS版本(node版本至少为18.10.0)
nvm install --lts

# 0.4 安装pnpm(如果已安装则跳过)
npm install -g pnpm

# 1. 安装依赖
pnpm install

# 2. build 所有package
pnpm build

# 3. 启动服务
pnpm dev
