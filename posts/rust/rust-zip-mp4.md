---
title: 'Rust 构建 WebAssembly 模块实现 MP4 压缩功能'
date: '2024-01-01'
tags: ['Rust', 'WebAssembly', 'MP4', 'FFmpeg']
draft: false
desc: '本文介绍如何使用 Rust 构建 WebAssembly 模块来实现 MP4 视频压缩功能'
---

# Rust 构建 WebAssembly 模块实现 MP4 压缩教程

## 概述
本教程将指导你使用 Rust 构建一个 WebAssembly（WASM）模块，以实现 MP4 文件的压缩功能。我们会从项目搭建开始，逐步完成代码编写、编译，最终在 JavaScript 环境中使用该模块。

## 前置要求
1. **Rust 开发环境**：确保你已经安装了 Rust 工具链。可以从 [Rust 官方网站](https://www.rust-lang.org/tools/install) 下载并安装。
2. **`wasm-pack`**：用于将 Rust 代码编译成 WebAssembly 并生成 JavaScript 绑定。使用以下命令安装：
```bash
cargo install wasm-pack
```
3. **Node.js 和 npm**：用于后续在 JavaScript 环境中使用生成的 WASM 模块。从 [Node.js 官方网站](https://nodejs.org/) 下载并安装。
4. **FFmpeg 库**：我们将使用 FFmpeg 来处理 MP4 压缩，你需要在系统中安装 FFmpeg。具体安装方法可参考 [FFmpeg 官方文档](https://ffmpeg.org/download.html)。

## 步骤

### 1. 创建新的 Rust 项目
打开终端，执行以下命令创建一个新的 Rust 库项目：
```bash
cargo new --lib rust_wasm_mp4_compression
cd rust_wasm_mp4_compression
```

### 2. 配置 `Cargo.toml`
在项目根目录下找到 `Cargo.toml` 文件，添加必要的依赖和配置，使其内容如下：
```toml
[package]
name = "rust_wasm_mp4_compression"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"
ffmpeg-next = "4.4"

[dev-dependencies]
wasm-bindgen-test = "0.2"

[features]
default = ["console_error_panic_hook"]
console_error_panic_hook = ["console_error_panic_hook"]
```
这里，`wasm-bindgen` 用于实现 Rust 和 JavaScript 之间的交互，`ffmpeg-next` 是 Rust 对 FFmpeg 的封装库，用于处理 MP4 压缩。

### 3. 编写 Rust 代码
在 `src/lib.rs` 文件中编写实现 MP4 压缩功能的代码：
```rust
use wasm_bindgen::prelude::*;
use std::process::Command;

/// 对输入的 MP4 文件进行压缩
#[wasm_bindgen]
pub fn compress_mp4(input_path: &str, output_path: &str) -> Result<(), JsValue> {
    let output = Command::new("ffmpeg")
      .arg("-i")
      .arg(input_path)
      .arg("-vcodec")
      .arg("libx264")
      .arg("-crf")
      .arg("28")
      .arg(output_path)
      .output()
      .map_err(|e| JsValue::from_str(&format!("FFmpeg command execution error: {}", e)))?;

    if!output.status.success() {
        let error_message = String::from_utf8_lossy(&output.stderr);
        return Err(JsValue::from_str(&format!("FFmpeg compression error: {}", error_message)));
    }

    Ok(())
}
```
这段代码定义了一个 `compress_mp4` 函数，它接受输入文件路径和输出文件路径作为参数，调用 FFmpeg 命令进行 MP4 压缩。

### 4. 编译 Rust 代码为 WebAssembly
在项目根目录下执行以下命令，使用 `wasm-pack` 编译 Rust 代码为 WebAssembly 模块：
```bash
wasm-pack build --target web
```
这个命令会在项目目录下生成一个 `pkg` 文件夹，其中包含编译好的 WASM 文件以及对应的 JavaScript 绑定文件。

### 5. 创建 JavaScript 项目并使用 WASM 模块
#### 创建 HTML 文件
在项目根目录下创建一个 `index.html` 文件，内容如下：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rust WASM MP4 Compression Example</title>
</head>
<body>
    <input type="file" id="inputFile" accept=".mp4">
    <button id="compressButton">Compress MP4</button>
    <script type="module">
        import init, { compress_mp4 } from './pkg/rust_wasm_mp4_compression.js';

        async function run() {
            await init();

            const inputFile = document.getElementById('inputFile');
            const compressButton = document.getElementById('compressButton');

            compressButton.addEventListener('click', async () => {
                const file = inputFile.files[0];
                if (file) {
                    const inputPath = URL.createObjectURL(file);
                    const outputPath = 'compressed.mp4';

                    try {
                        await compress_mp4(inputPath, outputPath);
                        console.log('MP4 compression completed successfully.');
                    } catch (error) {
                        console.error('MP4 compression error:', error);
                    }
                }
            });
        }

        run();
    </script>
</body>
</html>
```
这个 HTML 文件提供了一个文件选择器和一个压缩按钮，用户可以选择一个 MP4 文件，点击按钮触发压缩操作。

#### 启动本地服务器
为了在浏览器中运行这个 HTML 文件，我们需要启动一个本地服务器。可以使用 `http-server`，如果没有安装，可以使用以下命令进行安装：
```bash
npm install -g http-server
```
然后在项目根目录下启动服务器：
```bash
http-server
```

#### 在浏览器中测试
打开浏览器，访问 `http://localhost:8080`（如果端口被占用，`http-server` 会提示使用其他端口）。选择一个 MP4 文件，点击压缩按钮，在浏览器的开发者工具控制台中可以看到压缩操作的结果。

## 总结
通过以上步骤，你成功地使用 Rust 构建了一个 WebAssembly 模块，实现了 MP4 文件的压缩功能，并在 JavaScript 环境中使用了这个模块。你可以根据实际需求进一步优化和扩展这个模块，例如调整压缩参数等。

## 常见问题及解决方法
- **编译错误**：如果在执行 `wasm-pack build` 时出现编译错误，检查 `Cargo.toml` 文件中的依赖版本是否正确，或者查看 Rust 代码是否存在语法错误。
- **FFmpeg 调用问题**：如果压缩过程中出现 FFmpeg 相关的错误，确保系统中已经正确安装了 FFmpeg，并且其可执行文件在系统的环境变量中。
- **浏览器加载问题**：如果在浏览器中无法加载 WASM 模块，确保 `index.html` 文件中的 `import` 路径正确，并且本地服务器正常运行。
 