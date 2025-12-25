import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'site-lang'

const messages = {
  zh: {
    common: {
      brandTitle: '票据真实性检测平台',
      brandDesc: '融合：图像篡改定位 + 防AI伪造 + 风险解释',
      language: '语言',
      zh: '中文',
      en: 'English'
    },
    home: {
      heroTitle: '图片篡改检测平台',
      heroDesc: '高效检测文档、票据、合同等图片是否被篡改，融合AI智能分析与多元检测技术，为您的业务安全保驾护航。',
      welcome: '欢迎使用图片篡改检测系统',
      bullets: [
        '⚡ 支持各类图片防伪检测，如票据、合同、回单等',
        '🧠 采用多模型融合：内容篡改定位、OCR一致性与解释',
        '🔒 数据隐私，前端直传，后台不留存原始文件',
        '🧾 提供可疑区域热力图、字段一致性多维校验'
      ],
      cta: '进入系统 / 登录'
    },
    login: {
      title: '登录 - 图片篡改检测',
      username: '账号',
      password: '密码',
      submit: '登录',
      error: '账号或密码错误'
    },
    detect: {
      headerTitle: '票据真实性检测平台',
      headerDesc: '融合：图像篡改定位 + 防AI伪造 + 风险解释',
      mockSwitchTitleOn: '切换到真实 API',
      mockSwitchTitleOff: '使用内置模拟结果，不调用后端',
      mockSwitchBtnOn: '切换到 API 模式',
      mockSwitchBtnOff: '使用模拟模式',
      clear: '清空',
      uploadTitle: '上传票据 / 合同 / 回单图片',
      uploadSub: '支持 JPG/PNG。建议上传原图；截图/转发图也可以，但检测会更偏“风险提示”。',
      privacy: '隐私提示：谨慎上传敏感信息',
      sampleTitle: '示例样本',
      sampleDesc: '点击样例可自动渲染：热力图、风险等级、综合置信度、可疑区域占比等',
      sampleCount: '共 {count} 个',
      pills: {
        scene: '🎯 场景：票据/合同/回单防伪',
        model: '🧠 模型：篡改定位 + 文本改动检测',
        rules: '🧾 规则：金额/税额/日期一致性'
      },
      start: '开始检测',
      export: '导出结果',
      exportTitle: '导出本次检测结果（JSON）',
      hint: '建议流程：先看热力图 → 再看可疑原因 → 最后核对字段一致性。',
      tabOriginal: '原图',
      tabOverlay: '热力图叠加',
      tabOverlayTitle: '显示篡改热力图叠加（需要后端返回 heatmap）',
      tabEmpty: '未选择图片',
      dropTitle: '点击上传文件 / 拖拽文件到此处',
      dropSub: '支持 jpg、png、bmp、pdf、tiff、webp、单帧 gif（示例）；单文件 ≤ 10MB',
      dropBtn: '选择文件',
      resultTitle: '检测结果',
      resultSub: '输出风险等级 + 证据点 + 字段校验',
      modeMock: '模式：模拟',
      modeApi: '模式：API',
      kpiRisk: '风险等级',
      kpiConfidence: '综合置信度',
      kpiArea: '可疑区域占比',
      reasonsTitle: '图像篡改可疑原因',
      reasonCountLabel: '条',
      reasonEmptyTitle: '暂无',
      reasonEmptyDesc: '还没有可展示的数据。',
      rulesTitle: '字段一致性检查',
      ruleCountLabel: '项',
      ruleEmptyTitle: '暂无',
      ruleEmptyDesc: '还没有可展示的数据。',
      historyTitle: '检测历史',
      historyEmpty: '暂无历史记录。你可以多测几张票据，对比不同风险解释与热力图效果。',
      historyViewBtn: '查看',
      historyLoading: '加载中…',
      historyEnd: '没有更多了',
      historyConfidence: '置信度',
      historyArea: '占比',
      apiChipMock: 'API：未调用（模拟结果）',
      apiChipReal: 'API：{api}',
      defaults: {
        imgMeta: '未选择图片',
        statusWaiting: '等待上传…',
        statusUploaded: '已上传，等待检测…',
        statusSample: '已载入示例 ✅（结果已自动渲染）',
        statusDetectingMock: '模拟检测中…',
        statusDetecting: '正在检测中…',
        statusDone: '检测完成 ✅',
        statusFail: '检测失败 ❌',
        timeCostIdle: '耗时：—',
        timeCostFmt: '耗时：{ms} ms',
        toastTitle: '提示',
        dash: '—',
        needHeatmap: '需要 heatmap',
        areaHigh: '区域较大，优先核验',
        areaLow: '区域较小，结合规则判断',
        riskPrefix: '风险：{level}',
        riskEmpty: '未检测',
        sampleMeta: '{title} · 示例样本',
        sampleToastTitle: '已载入示例',
        sampleToastDesc: '已展示：{title}（{risk}）',
        modeSwitched: '模式已切换',
        modeSwitchedMock: '将使用内置模拟结果，不调用后端 API。',
        modeSwitchedApi: '将调用后端 API 进行真实检测。',
        cleared: '已清空',
        clearedDesc: '你可以重新上传新图片进行检测。',
        pasteTitle: '已粘贴图片',
        pasteDesc: '已从剪贴板读取图片并加载预览。',
        noHeatmap: '还没有热力图',
        noHeatmapDesc: '需要后端返回 heatmap_base64 / heatmap_url，或使用模拟模式体验。',
        noUploadTitle: '还没上传',
        noUploadDesc: '请先上传一张票据/文档图片。',
        invalidFile: '不支持的文件',
        invalidFileDesc: '请上传 JPG/PNG 等图片文件。',
        largeFile: '文件过大',
        largeFileDesc: '建议不超过 10MB（你也可以在代码里放宽限制）。',
        detectDoneTitle: '检测完成',
        detectDoneDesc: '你可以切换到“热力图叠加”，并查看右侧解释与规则命中。',
        detectFailTitle: '检测失败',
        detectFailUnknown: '未知错误',
        noResultTitle: '还没有结果',
        noResultDesc: '请先完成一次检测。',
        exportedTitle: '已导出',
        exportedDesc: 'detect_result.json 已下载。',
        historyLoadedTitle: '已载入历史',
        historyLoadedDesc: '右侧结果与热力图已恢复。',
        apiError: 'API 响应错误：{status} {statusText}{extra}'
      },
      riskConclusion: {
        HIGH: '高风险：疑似篡改/伪造',
        MID: '中风险：存在可疑痕迹',
        LOW: '低风险：未见明显异常',
        default: '—'
      },
      reasonFallback: '可疑点',
      ruleFallback: '规则校验',
      mockReasons: {
        tamper: { title: '金额区域疑似被替换', detail: '金额附近边缘融合异常、噪声指纹不一致。' },
        clean: { title: '未发现明显篡改痕迹', detail: '整体纹理连续，边缘/字体一致性较好。' },
        recompress: { title: '压缩/重编码痕迹', detail: '检测到一定压缩块结构（可能来自截图/转发）。' },
        date: { title: '日期字段渲染不一致', detail: '日期区域清晰度与正文不同，疑似后贴。' }
      },
      mockRules: {
        amount: { name: '小写金额 vs 大写金额', detailHigh: '不一致（建议人工复核）', detailPass: '一致' },
        sum: { name: '税额 + 金额 = 合计', detailMid: '存在微小偏差（可能 OCR 误差）', detailPass: '通过' },
        layout: { name: '关键字段位置合理性', detail: '版式结构与常见模板匹配度较高' }
      },
      sampleMetas: [
        { id: 's1', title: '发票样例 A', subtitle: '字段清晰 / 低风险', risk_level: 'LOW', confidence: 0.88, area: 0.012, seed: 11,
          lines: ['开票日期：2025-12-23', '购买方：某某科技有限公司', '金额：￥ 12,480.00', '税额：￥ 748.80', '价税合计：￥ 13,228.80'] },
        { id: 's2', title: '回单样例 B', subtitle: '疑似二次压缩', risk_level: 'MID', confidence: 0.74, area: 0.062, seed: 22,
          lines: ['交易日期：2025-11-18', '付款方：张三', '收款方：某某商贸', '金额：￥ 7,600.00', '附言：货款'] },
        { id: 's3', title: '合同样例 C', subtitle: '金额区域可疑', risk_level: 'HIGH', confidence: 0.91, area: 0.141, seed: 33,
          lines: ['合同编号：HT-2025-0312', '甲方：某某有限公司', '乙方：某某供应链', '合同金额：￥ 760,000.00', '签署日期：2025-10-02'] },
        { id: 's4', title: '发票样例 D', subtitle: '合计校验轻微偏差', risk_level: 'MID', confidence: 0.69, area: 0.049, seed: 44,
          lines: ['开票日期：2025-09-06', '购买方：某某制造', '金额：￥ 98,000.00', '税额：￥ 5,880.00', '价税合计：￥ 103,880.00'] },
        { id: 's5', title: '收据样例 E', subtitle: '日期渲染不一致', risk_level: 'HIGH', confidence: 0.86, area: 0.118, seed: 55,
          lines: ['收据编号：SJ-002718', '收款日期：2025-08-21', '收款单位：某某物业', '金额：￥ 2,600.00', '备注：押金'] }
      ]
    }
  },
  en: {
    common: {
      brandTitle: 'Document Authenticity Detection',
      brandDesc: 'Fusion: tamper localization + AI forgery defense + risk explanations',
      language: 'Language',
      zh: '中文',
      en: 'English'
    },
    home: {
      heroTitle: 'Image Tamper Detection',
      heroDesc: 'Detect tampering for documents, invoices, contracts, and more with AI analysis plus multi-signal checks to safeguard your business.',
      welcome: 'Welcome to the tamper detection console',
      bullets: [
        '⚡ Detect anti-forgery on invoices, contracts, receipts, and more',
        '🧠 Multi-model fusion: tamper localization, OCR consistency, explanations',
        '🔒 Privacy-first: upload from frontend; backend need not persist originals',
        '🧾 Heatmaps for suspicious areas plus multi-dimensional field checks'
      ],
      cta: 'Enter / Sign in'
    },
    login: {
      title: 'Login - Tamper Detection',
      username: 'Username',
      password: 'Password',
      submit: 'Login',
      error: 'Incorrect username or password'
    },
    detect: {
      headerTitle: 'Document Authenticity Detection',
      headerDesc: 'Fusion: tamper localization + AI forgery defense + risk explanations',
      mockSwitchTitleOn: 'Switch to real API',
      mockSwitchTitleOff: 'Use built-in mock results without calling backend',
      mockSwitchBtnOn: 'Switch to API mode',
      mockSwitchBtnOff: 'Use mock mode',
      clear: 'Clear',
      uploadTitle: 'Upload invoice / contract / receipt image',
      uploadSub: 'Supports JPG/PNG. Upload originals when possible; screenshots/forwards also work but lean toward “risk hints”.',
      privacy: 'Privacy: handle sensitive data carefully',
      sampleTitle: 'Sample cases',
      sampleDesc: 'Click a sample to auto-render heatmap, risk level, confidence, and suspicious area ratio.',
      sampleCount: 'Total {count}',
      pills: {
        scene: '🎯 Scenario: anti-forgery for invoices/contracts/receipts',
        model: '🧠 Model: tamper localization + text-change detection',
        rules: '🧾 Rules: amount/tax/date consistency'
      },
      start: 'Start detection',
      export: 'Export result',
      exportTitle: 'Export this detection (JSON)',
      hint: 'Recommended flow: heatmap → suspicious reasons → field consistency.',
      tabOriginal: 'Original',
      tabOverlay: 'Heatmap overlay',
      tabOverlayTitle: 'Show tamper heatmap overlay (backend must return heatmap)',
      tabEmpty: 'No image selected',
      dropTitle: 'Click to upload / drag a file here',
      dropSub: 'Supports jpg, png, bmp, pdf, tiff, webp, single-frame gif (demo); single file ≤ 10MB',
      dropBtn: 'Choose file',
      resultTitle: 'Detection result',
      resultSub: 'Risk level + evidence + field checks',
      modeMock: 'Mode: Mock',
      modeApi: 'Mode: API',
      kpiRisk: 'Risk level',
      kpiConfidence: 'Overall confidence',
      kpiArea: 'Suspicious area ratio',
      reasonsTitle: 'Suspicious reasons',
      reasonCountLabel: 'items',
      reasonEmptyTitle: 'None',
      reasonEmptyDesc: 'No data to show yet.',
      rulesTitle: 'Field consistency checks',
      ruleCountLabel: 'items',
      ruleEmptyTitle: 'None',
      ruleEmptyDesc: 'No data to show yet.',
      historyTitle: 'History',
      historyEmpty: 'No history yet. Run a few documents to compare risk explanations and heatmaps.',
      historyViewBtn: 'View',
      historyLoading: 'Loading…',
      historyEnd: 'No more',
      historyConfidence: 'Confidence',
      historyArea: 'Area',
      apiChipMock: 'API: mock (no backend call)',
      apiChipReal: 'API: {api}',
      defaults: {
        imgMeta: 'No image selected',
        statusWaiting: 'Waiting for upload…',
        statusUploaded: 'Uploaded, ready to detect…',
        statusSample: 'Sample loaded ✅ (results pre-rendered)',
        statusDetectingMock: 'Mock detection…',
        statusDetecting: 'Detecting…',
        statusDone: 'Detection finished ✅',
        statusFail: 'Detection failed ❌',
        timeCostIdle: 'Elapsed: —',
        timeCostFmt: 'Elapsed: {ms} ms',
        toastTitle: 'Notice',
        dash: '—',
        needHeatmap: 'Heatmap required',
        areaHigh: 'Large suspicious area — review carefully',
        areaLow: 'Small suspicious area — confirm with rules',
        riskPrefix: 'Risk: {level}',
        riskEmpty: 'Not run',
        sampleMeta: '{title} · Sample',
        sampleToastTitle: 'Sample loaded',
        sampleToastDesc: 'Showing: {title} ({risk})',
        modeSwitched: 'Mode switched',
        modeSwitchedMock: 'Using built-in mock results; backend not called.',
        modeSwitchedApi: 'Calling backend API for real detection.',
        cleared: 'Cleared',
        clearedDesc: 'You can upload another image to detect.',
        pasteTitle: 'Image pasted',
        pasteDesc: 'Read image from clipboard and loaded preview.',
        noHeatmap: 'No heatmap yet',
        noHeatmapDesc: 'Backend must return heatmap_base64 / heatmap_url, or use mock mode to try.',
        noUploadTitle: 'No upload yet',
        noUploadDesc: 'Please upload a document image first.',
        invalidFile: 'Unsupported file',
        invalidFileDesc: 'Please upload JPG/PNG or other image formats.',
        largeFile: 'File too large',
        largeFileDesc: 'Suggested limit 10MB (you can relax in code).',
        detectDoneTitle: 'Detection finished',
        detectDoneDesc: 'Switch to heatmap overlay and review right-side explanations and rules.',
        detectFailTitle: 'Detection failed',
        detectFailUnknown: 'Unknown error',
        noResultTitle: 'No result yet',
        noResultDesc: 'Please finish a detection first.',
        exportedTitle: 'Exported',
        exportedDesc: 'detect_result.json downloaded.',
        historyLoadedTitle: 'History loaded',
        historyLoadedDesc: 'Restored results and heatmap on the right.',
        apiError: 'API error: {status} {statusText}{extra}'
      },
      riskConclusion: {
        HIGH: 'High risk: possible tamper/forgery',
        MID: 'Medium risk: suspicious traces detected',
        LOW: 'Low risk: no obvious anomalies',
        default: '—'
      },
      reasonFallback: 'Suspicious point',
      ruleFallback: 'Rule check',
      mockReasons: {
        tamper: { title: 'Amount area may be replaced', detail: 'Noise fingerprint and edge fusion look inconsistent near the amount.' },
        clean: { title: 'No obvious tampering found', detail: 'Texture is continuous; edges/fonts stay consistent.' },
        recompress: { title: 'Compression / re-encode traces', detail: 'Detected possible re-compression blocks (e.g., screenshot/forwarded).' },
        date: { title: 'Date rendering inconsistent', detail: 'Date region sharpness differs from body text; likely pasted.' }
      },
      mockRules: {
        amount: { name: 'Amount consistency (lowercase vs uppercase)', detailHigh: 'Mismatch (manual review suggested)', detailPass: 'Consistent' },
        sum: { name: 'Tax + amount = total', detailMid: 'Slight deviation (could be OCR error)', detailPass: 'Pass' },
        layout: { name: 'Key fields in reasonable positions', detail: 'Layout aligns with common templates' }
      },
      sampleMetas: [
        { id: 's1', title: 'Invoice sample A', subtitle: 'Fields clear / low risk', risk_level: 'LOW', confidence: 0.88, area: 0.012, seed: 11,
          lines: ['Issue date: 2025-12-23', 'Buyer: ACME Tech Co., Ltd.', 'Amount: ¥ 12,480.00', 'Tax: ¥ 748.80', 'Total: ¥ 13,228.80'] },
        { id: 's2', title: 'Receipt sample B', subtitle: 'Possible recompression', risk_level: 'MID', confidence: 0.74, area: 0.062, seed: 22,
          lines: ['Transaction date: 2025-11-18', 'Payer: Zhang San', 'Payee: Tradeway', 'Amount: ¥ 7,600.00', 'Note: goods payment'] },
        { id: 's3', title: 'Contract sample C', subtitle: 'Amount region suspicious', risk_level: 'HIGH', confidence: 0.91, area: 0.141, seed: 33,
          lines: ['Contract No.: HT-2025-0312', 'Party A: Contoso Ltd.', 'Party B: Supply Chain Inc.', 'Amount: ¥ 760,000.00', 'Signing date: 2025-10-02'] },
        { id: 's4', title: 'Invoice sample D', subtitle: 'Minor sum deviation', risk_level: 'MID', confidence: 0.69, area: 0.049, seed: 44,
          lines: ['Issue date: 2025-09-06', 'Buyer: Fabrikam', 'Amount: ¥ 98,000.00', 'Tax: ¥ 5,880.00', 'Total: ¥ 103,880.00'] },
        { id: 's5', title: 'Receipt sample E', subtitle: 'Date rendering mismatch', risk_level: 'HIGH', confidence: 0.86, area: 0.118, seed: 55,
          lines: ['Receipt No.: SJ-002718', 'Paid on: 2025-08-21', 'Payee: Property Co.', 'Amount: ¥ 2,600.00', 'Note: deposit'] }
      ]
    }
  }
}

const initialLang = (() => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && messages[saved]) return saved
  }
  return 'zh'
})()

const lang = ref(initialLang)
const dict = computed(() => messages[lang.value] || messages.zh)

function t(key, vars = {}) {
  const parts = key.split('.')
  let cur = dict.value
  for (const p of parts) {
    cur = cur?.[p]
  }
  if (typeof cur !== 'string') return cur
  return cur.replace(/\{(\w+)\}/g, (_, k) => (vars?.[k] ?? ''))
}

function setLang(next) {
  if (!messages[next]) return
  lang.value = next
}

watch(lang, (v) => {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, v)
  } catch {
    // ignore persistence errors
  }
})

export function useI18n() {
  return { lang, setLang, t, dict }
}
