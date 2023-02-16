# lyh-tracker

这是一个埋点SDK

## 用法

构建

```bash
git clone https://github.com/ten1fs/lyh-tracker
cd lyh-tracker
npm install
npm run build
```

参数

```tsx
/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带tracker-key 点击事件上报
 * @sdkVersion sdk版本
 * @extra 透传字段
 * @jsError js和promise异常上报
 */
export interface DefaultOptions {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError: boolean
}
```

示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>lyh-tracker-example</title>
    <style>
        button {
            width: 200px;
            height: 50px;
        }
    </style>
</head>
<body>
    <!-- 只要有target-key就会自动上报 -->
    <button target-key="1">按钮1</button>
    <button>按钮2</button>

    <script src="./dist/index.js"></script>
    <script>
        const tr = new tracker({
            requestUrl: 'http://localhost:8888/tracker', // 接口地址
            historyTracker: true,
            hashTracker: true,
            domTracker: true,
            jsError: true
        })
        // 设置用户ID
        const uuid = '76a7ef23-adde-11ed-8743-a036bce63a69'
        tr.setUserId(uuid)
    </script>
</body>
</html>
```



## 参考资料

[https://github.com/message163/tracker](https://github.com/message163/tracker)
