# 使用说明

## 准备
安装nodejs包  
下载代码之后，在目录内运行
```shell
npm i
```

## 配置文件  
参考 ```.env.example``` 创建自己的```.env```文件  
参数说明：  
- ```ETHERSCAN_API_KEY``` 浏览器合约验证，需要的API KEY
- ```PRIVATE_KEY``` 部署合约的私钥，注意妥善保管
- ```team``` 分60期线性释放接收地址，共铸造20,000,000
- ```t2``` 分120期线性释放接收地址，共铸造50,000,000
- ```foundation``` 基金会接收地址，立即铸造10,000,000
- ```others``` 其他预挖代币接收地址，立即铸造18,000,000
- ```blocks``` 分期释放每期的出块数，例：3秒一个块，周期一个月，则值为：```30*24*60*60/3 = 86400```
- ```airdrop``` 空投的份数，每一份100Token。
  
## 预设命令
- ```npm run compile``` 编译合约
- ```npm run clean``` 清理工作区
- ```npm run test``` 运行测试脚本
- ```npm run deploy-bsc``` 合约部署到BSC主网
- ```npm run deploy-bsctest``` 合约部署到BSC测试网

