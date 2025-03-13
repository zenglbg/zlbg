---
title: 'Rust 构建 WebAssembly 模块实现 Gzip 和 Ungzip 功能'
date: '2024-01-01'
tags: ['Rust', 'WebAssembly', 'Gzip']
draft: false
summary: '本文介绍如何使用 Rust 构建 WebAssembly 模块来实现 Gzip 压缩和解压缩功能'
---

# Rust 构建 WebAssembly 模块实现 Gzip 和 Ungzip 功能

## 概述
本教程将指导你如何使用 Rust 构建一个 WebAssembly（WASM）模块，该模块具备 Gzip 压缩和解压缩（Ungzip）的功能。我们会逐步完成项目搭建、代码编写、编译，最后在 JavaScript 环境中使用这个模块。

## 前置要求
- **Rust 开发环境**：确保你已经安装了 Rust 工具链。可以从 [Rust 官方网站](https://www.rust-lang.org/tools/install) 下载并安装。
- **`wasm-pack`**：用于将 Rust 代码编译成 WebAssembly 并生成 JavaScript 绑定。使用以下命令安装：
```bash
cargo install wasm-pack
```
- **Node.js 和 npm**：用于后续在 JavaScript 环境中使用生成的 WASM 模块。从 [Node.js 官方网站](https://nodejs.org/) 下载并安装。

## 步骤

### 1. 创建新的 Rust 项目
打开终端，执行以下命令创建一个新的 Rust 库项目：
```bash
cargo new --lib rust_wasm_gzip
cd rust_wasm_gzip
```

### 2. 配置 `Cargo.toml`
在项目根目录下找到 `Cargo.toml` 文件，添加必要的依赖和配置，使其内容如下：
```toml
[package]
name = "rust_wasm_gzip"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"
flate2 = { version = "1.0", features = ["gzip"] }

[dev-dependencies]
wasm-bindgen-test = "0.2"

[features]
default = ["console_error_panic_hook"]
console_error_panic_hook = ["console_error_panic_hook"]
```
这里，`wasm-bindgen` 用于实现 Rust 和 JavaScript 之间的交互，`flate2` 库提供了 Gzip 压缩和解压缩功能。

### 3. 编写 Rust 代码
在 `src/lib.rs` 文件中编写实现 Gzip 和 Ungzip 功能的代码：
```rust
use wasm_bindgen::prelude::*;
use flate2::read::{GzDecoder, GzEncoder};
use flate2::Compression;
use std::io::{Read, Write};

/// 对输入的字节切片进行 Gzip 压缩
#[wasm_bindgen]
pub fn gzip(input: &[u8]) -> Result<Vec<u8>, JsValue> {
    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    if let Err(e) = encoder.write_all(input) {
        return Err(JsValue::from_str(&format!("Gzip encoding error: {}", e)));
    }
    match encoder.finish() {
        Ok(result) => Ok(result),
        Err(e) => Err(JsValue::from_str(&format!("Gzip encoding error: {}", e))),
    }
}

/// 对输入的 Gzip 压缩字节切片进行解压缩
#[wasm_bindgen]
pub fn ungzip(input: &[u8]) -> Result<Vec<u8>, JsValue> {
    let mut decoder = GzDecoder::new(input);
    let mut output = Vec::new();
    if let Err(e) = decoder.read_to_end(&mut output) {
        return Err(JsValue::from_str(&format!("Gzip decoding error: {}", e)));
    }
    Ok(output)
}
```

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
    <title>Rust WASM Gzip Example</title>
</head>
<body>
    <script type="module">
        import init, { gzip, ungzip } from './pkg/rust_wasm_gzip.js';

        async function run() {
            await init();

            const inputText = "Hello, WebAssembly Gzip!";
            const inputBytes = new TextEncoder().encode(inputText);

            // 进行 Gzip 压缩
            const compressedBytes = gzip(inputBytes);
            console.log('Compressed bytes length:', compressedBytes.length);

            // 进行解压缩
            const decompressedBytes = ungzip(compressedBytes);
            const decompressedText = new TextDecoder().decode(decompressedBytes);
            console.log('Decompressed text:', decompressedText);
        }

        run();
    </script>
</body>
</html>
```

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
打开浏览器，访问 `http://localhost:8080`（如果端口被占用，`http-server` 会提示使用其他端口），打开浏览器的开发者工具，在控制台中可以看到压缩和解压缩的结果。

## 总结
通过以上步骤，你成功地使用 Rust 构建了一个 WebAssembly 模块，实现了 Gzip 压缩和解压缩功能，并在 JavaScript 环境中使用了这个模块。你可以根据实际需求进一步扩展这个模块，应用到更复杂的项目中。

## 常见问题及解决方法
- **编译错误**：如果在执行 `wasm-pack build` 时出现编译错误，检查 `Cargo.toml` 文件中的依赖版本是否正确，或者查看 Rust 代码是否存在语法错误。
- **浏览器加载问题**：如果在浏览器中无法加载 WASM 模块，确保 `index.html` 文件中的 `import` 路径正确，并且本地服务器正常运行。

---

以上内容可以直接保存为 `README.md` 文件，为你提供了一个完整的从 Rust 编写到在 JavaScript 中使用 WASM 模块实现 Gzip 和 Ungzip 功能的教程。 