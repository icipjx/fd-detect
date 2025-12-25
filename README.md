# 票据真实性检测 Demo（Vue 3 + Vite）

## 启动
```bash
npm install
npm run dev
```

## 后端接口（可选）
默认调用：
- `POST /api/detect`（multipart/form-data，字段名：file）

如果你还没后端，可以在页面右上角切换到“模拟模式”体验前端交互。

## 期望返回 JSON（建议）
```json
{
  "risk_level": "LOW|MEDIUM|HIGH",
  "confidence": 0.0,
  "tamper_area_ratio": 0.0,
  "heatmap_base64": "data:image/png;base64,...",
  "reasons": [{"title":"...","detail":"...","severity":"PASS|WARN|FAIL"}],
  "rules": [{"name":"...","detail":"...","status":"PASS|WARN|FAIL","tag":"...","value":"..."}]
}
```
