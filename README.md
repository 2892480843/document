# 简易流式计算系统

这是一个基于Java实现的简易流式计算系统，支持基本的流计算功能和中级特性，包括事件时间窗口处理、数据撤回等功能。

## 系统要求

- JDK 11或更高版本
- Maven 3.6或更高版本

## 项目结构

- `src/main/java/com/streamcompute/core/`: 核心组件（Graph、Node、Edge等）
- `src/main/java/com/streamcompute/nodes/`: 节点实现（Source、Process、Sink节点）
- `src/main/java/com/streamcompute/window/`: 窗口处理相关实现
- `src/main/java/com/streamcompute/example/`: 示例代码

## 功能特性

1. 基础流式系统运行（必须）
   - 完整的节点、边处理
   - 可持续运行的流式系统

2. 中级流式系统特性（可选）
   - 支持事件时间语义下的window处理
   - 支持retract处理
   - 支持自动故障恢复

3. 高级流式系统特性
   - 支持exactly once处理语义

## 构建和运行

### 在Mac上运行

1. 克隆项目到本地
2. 进入项目目录
3. 编译和打包：
   ```bash
   mvn clean package
   ```
4. 运行示例程序：
   ```bash
   mvn exec:java
   ```
   或者直接运行jar包：
   ```bash
   java -jar target/simple-stream-compute-1.0-SNAPSHOT-jar-with-dependencies.jar
   ```

### 在Windows上运行

1. 确保已安装JDK 11和Maven
2. 打开命令提示符或PowerShell
3. 进入项目目录
4. 编译和打包：
   ```cmd
   mvn clean package
   ```
5. 运行示例程序：
   ```cmd
   mvn exec:java
   ```
   或者直接运行jar包：
   ```cmd
   java -jar target\simple-stream-compute-1.0-SNAPSHOT-jar-with-dependencies.jar
   ```

## 运行示例说明

示例程序会创建一个简单的流计算图，包含以下组件：

1. 源节点（SourceNode）：生成模拟的传感器数据
2. 处理节点（ProcessNode）：
   - 转换数据为可撤回格式
   - 进行窗口计算和聚合
3. 接收节点（SinkNode）：输出计算结果

程序会运行30秒后自动停止，期间会：
- 每500毫秒生成一条传感器数据
- 每1秒触发一次窗口计算
- 随机生成数据撤回操作（10%概率）

## 日志输出说明

程序运行时会输出以下类型的日志：
- 系统启动和停止信息
- 数据处理过程信息
- 窗口触发和计算结果
- 数据撤回操作信息

## 测试

运行单元测试：
```bash
 mvn test
```

## 注意事项

1. 确保系统已安装正确版本的JDK
2. 如果遇到内存不足，可以调整JVM参数：
   ```bash
   java -Xmx512m -jar target/simple-stream-compute-1.0-SNAPSHOT-jar-with-dependencies.jar
   ```
3. 程序使用了守护线程，正常情况下会自动退出，如果需要手动停止，可以使用Ctrl+C