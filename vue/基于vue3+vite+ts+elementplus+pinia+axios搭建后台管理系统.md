# 基于vue3+vite+ts+elementplus+pinia+axios搭建后台管理系统

## 创建项目
```shell
npm init vite@latest YOURPROJECTNAME --template vue-ts
```

## ESLint 代码检测

> ESLint 可组装的JavaScript和JSX检查工具，目标是保证代码的一致性和避免错误。

### ESLint 安装

#### ESLint 插件安装

vscode 插件市场搜索 ESLint 插件并安装

#### ESLint 依赖安装

```shell
npx eslint --init
```

> 会自动生成`eslint.config.js`文件

#### ESLint 忽略配置(.eslintignore)（可选）

> 在根目录下新建`.eslintignore`文件，添加忽略文件

```
dist
node_modules
public
.husky
.vscode
.idea
*.sh
*.md

src/assets

.eslintrc.cjs
.prettierrc.cjs
.stylelintrc.cjs
```

## Prettier 代码格式化

### 安装 Prettier 插件

> VSCode 插件市场搜索 Prettier - Code formatter 插件安装

### 格式化忽略配置( .prettierignore)

> 根目录下新建 `.prettierignore`文件，添加配置
```
dist
node_modules
public
.husky
.vscode
.idea
*.sh
*.md

src/assets
```

### Prettier 保存自动格式化

VSCode 的 settings.json 配置:

```
{
  "editor.formatOnSave": true, // 保存格式化文件
  "editor.defaultFormatter": "esbenp.prettier-vscode" // 指定 prettier 为所有文件默认格式化器
}
```

## 设置端口和本地访问域名

```ts
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 5175,
        host: 'saas_ads.com',
    },
});
```

> 需要更改本地host文件
> windows: `C:\Windows\System32\drivers\etc\hosts`
> macos: `/etc/hosts`

```shell
127.0.0.1		saas_ads.com
```

--------------------------------- 分割线 ---------------------------------

## 环境变量

Vite 环境变量主要是为了区分开发、测试、生产等环境的变量

[Vite 环境变量配置官方文档](https://cn.vite.dev/guide/env-and-mode.html)

### env配置文件

项目根目录新建 `.env.development`、`.env.production`

```env
# .env.development
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
VITE_APP_TITLE = 'saas-ads'
VITE_APP_PORT = 5175
VITE_APP_BASE_API = '/api'
```

```env
# .env.production
VITE_APP_TITLE = 'saas-ads'
VITE_APP_PORT = 5175
VITE_APP_BASE_API = '/api'
```

### 环境变量智能提示

新建 `src/types/env.d.ts` 文件存放环境变量TS类型声明

```ts
// src/types/env.d.ts
interface ImportMetaEnv {
    /**
     * 应用标题
     */
    VITE_APP_TITLE: string;
    /**
     * 应用端口
     */
    VITE_APP_PORT: number;
    /**
     * API基础路径(反向代理)
     */
    VITE_APP_BASE_API: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
```

### 使用

1、在html中使用
```html
<title>%VITE_APP_TITLE%</title>
```

2、在`vite.config.ts`中使用
```ts
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        server: {
            port: Number(env.VITE_APP_PORT),
            host: "saas_ads.com",
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: "https://saas_api.com",
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, ""),
                },
            },
        },
    };
});
```

2、在`*.ts`中使用
```ts
console.log(import.meta.env.VITE_APP_TITLE);
```

--------------------------------- 分割线 ---------------------------------

## 跨域

> 本地开发环境通过 Vite 配置反向代理解决浏览器跨域问题，生产环境则是通过 nginx 配置反向代理 。

看上一节内容


--------------------------------- 分割线 ---------------------------------

## src 路径别名配置

相对路径别名配置，使用 @ 代替 src

### 安装 @types/node

```shell
yarn add 安装 @types/node -D
```

### 修改 vite.config.ts

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5175,
    },
});
```

### 修改 tsconfig.json

> 如果有 `tsconfig.app.json`文件，建议放至`tsconfig.app.json`文件中。

```json
// tsconfig.json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

--------------------------------- 分割线 ---------------------------------

## 集成 Pinia

[Pinia官方文档](https://pinia.vuejs.org/zh)

### 安装Pinia依赖

```shell
yarn add pinia
```

### 引入 pinia

新建`src/store`目录并新建 `index.ts`文件

```ts
// src/store/index.ts
import { createPinia } from 'pinia';

// 这里导入store/modules下的状态文件
// import useStoreCounter from './modules/counter';
// ...

const pinia = createPinia();

// 这里导出
// export { useStoreCounter };
export default pinia;
```

#### main.ts引入store

```ts
// src/main.ts
import { createApp } from 'vue';

import App from './App.vue';
import store from '@/store';

import './style.css';

const app = createApp(App);
app.use(store);

app.mount('#app');
```

### 定义store

这里定义一个官网上的 计数器 为例

```ts
// src/store/counter.ts
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export default defineStore("counter", () => {
    // ref变量 → state 属性
    const count = ref(0);
    // computed计算属性 → getters
    const double = computed(() => {
        return count.value * 2;
    });
    // function函数 → actions
    function increment() {
        count.value++;
    }

    return { count, double, increment };
});
```

在 `src/store/index.ts`中导出 `useStoreCounter`

使用 `useStoreCounter`

```vue
<script setup lang="ts">
import { useStoreCounter } from "@/store";
const counterStore = useStoreCounter();
</script>

<template>
    <button @click="counterStore.increment">count++</button>
    <div>数字： {{ counterStore.count }}</div>
    <div>加倍：{{ counterStore.double }}</div>
</template>
```

--------------------------------- 分割线 ---------------------------------

## 集成 Element Plus

### 安装 Element Plus 依赖 和 unplugin-vue-components unplugin-auto-import

```shell
yarn add element-plus
yarn add unplugin-vue-components unplugin-auto-import -D
```

### 配置 vite.config.ts

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Element Plus
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
    plugins: [
        vue(),
        // 自动导入 Element Plus API
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        // 自动导入 Element Plus 组件
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
});
```

### 配置 TypeScript 支持

> 如果有 `tsconfig.app.json`文件，建议放至`tsconfig.app.json`文件中。

```json
// tsconfig.json
{
    "compilerOptions": {
        "types": ["element-plus/global"] // 添加 Element Plus 的类型支持
    }
}
```

### 使用 Element Plus 组件

```vue
<template>
    <el-button type="primary">Primary Button</el-button>
</template>
```

### 自定义主题

#### 安装 sass 依赖

```shell
yarn add sass -D
```

#### 修改 vite.config.ts

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver({ importStyle: 'sass' })], // 使用 sass
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/styles/element/index.scss" as *;`, // 自定义主题文件路径
            },
        },
    },
});
```

### 创建自定义主题文件

```scss
// src/styles/element/index.scss
@forward "element-plus/theme-chalk/src/common/var.scss" with (
  $colors: (
    "primary": (
      "base": #409eff,
    ),
  )
);

// If you just import on demand, you can ignore the following content.
// 如果你想导入所有样式:
// tips: 我导入了，可报@use死循环了，最终还是注释掉了
// @use "element-plus/theme-chalk/src/index.scss" as *;
```

--------------------------------- 分割线 ---------------------------------

## 集成 sass

### 安装 sass 依赖

```shell
yarn add sass -D
```

### 创建全局样式文件 main.scss

> 优化建议：
> 创建项目时,有默认的`src/style.css`，在`main.ts`文件中引用了。可以将`styles.css`样式，选择需要的复制到`src/styles/main.scss`文件中，删除`style.css`也它的引用

```scss
// src/styles/main.scss
$primary-color: #409eff;

body {
  font-family: Arial, sans-serif;
  background-color: $primary-color;
}

.container {
  padding: 20px;
  color: white;
}
```

### 全局引入 main.scss

一般情况下，修改 `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/styles/element/index.scss" as *;@use "@/styles/main.scss";`, // 全局引入，element/index.scss是element的主题替换文件
            },
        },
    },
});
```

--------------------------------- 分割线 ---------------------------------

## 集成 vite-plugin-svg-icons 使用Iconfont 第三方图标库实现本地图标

### 安装依赖

```shell
yarn add vite-plugin-svg-icons -D
```

###  配置 Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// vite-plugin-svg-icons
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // vite-plugin-svg-icons
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
            // 指定symbolId格式
            symbolId: "icon-[dir]-[name]",
        }),
    ],
});

```

### 创建 SVG 图标组件

```vue
<!-- src/components/SvgIcon.vue -->
<template>
    <svg aria-hidden="true" class="svg-icon">
        <use :xlink:href="symbolId" />
    </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

const symbolId = computed(() => `#icon-${props.name}`);
</script>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
```

### 使用 Iconfont 图标

你可以从 Iconfont 下载 SVG 图标，并将其放入 src/assets/icons 目录中。然后，你可以通过 SvgIcon 组件来使用这些图标。

例如，假设你下载了一个名为 home.svg 的图标，你可以这样使用它：

```vue
<template>
  <div>
    <SvgIcon name="home" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue';

export default defineComponent({
  components: {
    SvgIcon,
  },
});
</script>
```

### 自动导入 SVG 图标
```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import 'virtual:svg-icons-register'; // 自动导入 SVG 图标

const app = createApp(App);
app.mount('#app');
```

使用：

```vue
<template>
  <div>
    <SvgIcon name="home" />
  </div>
</template>
```

### 为 TypeScript 添加类型声明

```ts
// src/vite-env.d.ts
/// <reference types="vite-plugin-svg-icons/client" />
```

--------------------------------- 分割线 ---------------------------------

## 集成 Axios

### 安装依赖

```shell
yarn add axios
```

### Axios 工具类封装

```ts
// src/utils/request.ts
import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";

// 创建 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 50000,
    headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // const userStore = useUserStoreHook();
        // if (userStore.token) {
        //     config.headers.Authorization = userStore.token;
        // }
        return config;
    },
    (error: unknown) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const { msg } = response.data;
        // const { code, msg } = response.data;
        // if (code === "00000") {
        //     return response.data;
        // }

        // ElMessage.error(msg || "系统出错");
        return Promise.reject(new Error(msg || "Error"));
    },
    (error: any) => {
        if (error.response.data) {
            // const { code, msg } = error.response.data;
            // token 过期，跳转登录页
            // if (code === "A0230") {
            //     ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
            //         confirmButtonText: "确定",
            //         type: "warning",
            //     }).then(() => {
            //         localStorage.clear(); // @vueuse/core 自动导入
            //         window.location.href = "/";
            //     });
            // } else {
            //     ElMessage.error(msg || "系统出错");
            // }
        }
        return Promise.reject(error.message);
    }
);

// 导出 axios 实例
export default service;
```

### 使用示例

```ts
// src/api/auth.ts
import request from "@/utils/request";
import type { AxiosPromise } from "axios";
import { LoginData, LoginResult } from "./types";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
    return request({
        url: "/api/v1/auth/login",
        method: "post",
        params: data,
    });
}
```

--------------------------------- 分割线 ---------------------------------






















## 错误合集

### `src/main.ts`的`import 'virtual:svg-icons-register'; // 自动导入 SVG 图标`报`找不到模块“virtual:svg-icons-register”或其相应的类型声明`

> 解决方法：
> 修改`tsconfig.app.json`
```json
"compilerOptions": {
    "noUncheckedSideEffectImports": false,
},
```

### `src/main.ts`的`import store from '@/store';`报`找不到模块“@/store”或其相应的类型声明`

> 解决方法：
> 修改`src/main.ts`
```ts
import store from '@/store/index';
```
--------------------------------- 分割线 ---------------------------------
