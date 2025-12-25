<template>
  <div class="wrap">
    <div class="topbar">
      <div class="brand">
        <div class="logo" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l8.5 4.8v10.4L12 22l-8.5-4.8V6.8L12 2z" stroke="rgba(122,162,255,.95)" stroke-width="1.6"/>
            <path d="M12 7v10" stroke="rgba(122,162,255,.95)" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M7.6 12h8.8" stroke="rgba(122,162,255,.95)" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <h1>{{ commonText.brandTitle }}</h1>
          <p>{{ commonText.brandDesc }}</p>
        </div>
      </div>
      <div class="actions">
        <span class="chip">{{ apiChip }}</span>
        <button class="btn secondary" @click="toggleMock" :title="useMock ? detectText.mockSwitchTitleOn : detectText.mockSwitchTitleOff">
          {{ useMock ? detectText.mockSwitchBtnOn : detectText.mockSwitchBtnOff }}
        </button>
        <button class="btn danger" @click="clearAll">{{ detectText.clear }}</button>
      </div>
    </div>

    <div class="grid">
      <!-- Left -->
      <div class="card">
        <div class="hd">
          <div>
            <h2 class="title">{{ detectText.uploadTitle }}</h2>
            <p class="sub">{{ detectText.uploadSub }}</p>
          </div>
          <span class="badge" :title="detectText.privacy">{{ detectText.privacy }}</span>
        </div>

        <div class="bd">
          <!-- ✅ 示例样本（替换原上传条；上传入口已移至下方预览区） -->
          <div class="sampleStrip">
            <div class="sampleStripHd">
              <div class="sampleStripTitle">
                <b>{{ detectText.sampleTitle }}</b>
                <span>{{ detectText.sampleDesc }}</span>
              </div>
              <div class="sampleStripRight">
                <span class="badge">{{ sampleCountLabel }}</span>
              </div>
            </div>

            <div class="sampleStripList" role="list">
              <button
                v-for="s in sampleItems"
                :key="s.id"
                class="sampleCard"
                :class="{ active: activeSampleId === s.id }"
                type="button"
                role="listitem"
                @click="applySample(s)"
                :title="s.title"
              >
                <div class="sampleThumb">
                  <img :src="s.thumb" :alt="s.title" />
                  <span
                    class="sampleTagCorner"
                    :class="s.risk_level === 'LOW' ? 'good' : (s.risk_level === 'MID' ? 'warn' : 'bad')"
                  >
                    {{ s.risk_level }}
                  </span>

                  <div class="sampleInfoBar">
                    <div class="sampleTitleLine">{{ s.title }}</div>
                    <div class="sampleSubLine">{{ s.subtitle }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- ✅ 隐藏的 file input：供预览区点击选择文件使用 -->
          <input ref="fileInputEl" class="hiddenFileInput" type="file" accept="image/*" @change="onInputChange" />


          <div class="row pillRow">
            <span class="pill" :title="detectText.pills.scene"><span class="pill-text">{{ detectText.pills.scene }}</span></span>
            <span class="pill" :title="detectText.pills.model"><span class="pill-text">{{ detectText.pills.model }}</span></span>
          </div>

          <div class="row actionRow" style="margin-top:14px">
            <button class="btn" :disabled="!currentFile || busy" @click="detect">
              <span>{{ detectText.start }}</span><span aria-hidden="true">⚡</span>
            </button>
            <button class="btn secondary" :disabled="!currentResult" @click="downloadJson" :title="detectText.exportTitle">
              {{ detectText.export }}
            </button>
            <div class="hint hintEllipsis actionHint" :title="detectText.hint">
              <span class="pill-text">{{ detectText.hint }}</span>
            </div>
          </div>

          <div class="viewer" style="margin-top:14px">
            <div class="viewerTop">
              <div class="tabs" v-if="imageUrl">
                <button class="tab" :class="{active: !showOverlay}" @click="showOverlay=false">{{ detectText.tabOriginal }}</button>
                <button class="tab" :class="{active: showOverlay}" @click="toggleOverlay" :title="detectText.tabOverlayTitle">{{ detectText.tabOverlay }}</button>
              </div>
              <div class="tabs" v-else>
                <span class="badge">{{ detectText.tabEmpty }}</span>
              </div>
              <div class="row" style="margin:0">
                <span class="badge">{{ imgMeta }}</span>
              </div>
            </div>

            <div
                  class="canvasWrap dropPreview"
                  :class="{ showOverlay: showOverlay, drag: previewDragging, empty: !imageUrl }"
                  tabindex="0"
                  @click="onPreviewClick"
                  @dragenter.prevent="onPreviewDragEnter"
                  @dragover.prevent="onPreviewDragEnter"
                  @dragleave.prevent="onPreviewDragLeave"
                  @drop.prevent="onPreviewDrop"
                  @paste="onPreviewPaste"
                  >
                  <!-- 有图就显示图 -->
                  <img v-if="imageUrl" :src="imageUrl" :alt="detectText.tabOriginal" />

                  <!-- 热力图叠加 -->
                  <img class="overlay" v-if="imageUrl && heatmapUrl" :src="heatmapUrl" :alt="detectText.tabOverlay" />

                  <!-- 没图时显示图二那种引导界面 -->
                  <div v-if="!imageUrl" class="dropHint">
                      <div class="dropIcon" aria-hidden="true">
                      <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                          <path d="M12 16V7" stroke="rgba(122,162,255,.95)" stroke-width="1.8" stroke-linecap="round"/>
                          <path d="M8.8 10.2L12 7l3.2 3.2" stroke="rgba(122,162,255,.95)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M6 16.5c-1.7 0-3-1.3-3-3 0-1.5 1-2.7 2.4-3 0-.1 0-.2 0-.4 0-2.5 2-4.6 4.6-4.6.8 0 1.6.2 2.2.6C13 4.8 14.4 4 16 4c2.2 0 4 1.8 4 4 0 .3 0 .5-.1.8 1.8.3 3.1 1.9 3.1 3.7 0 2.1-1.7 3.8-3.8 3.8H6z"
                              stroke="rgba(122,162,255,.55)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      </div>

                      <div class="dropTitle">{{ detectText.dropTitle }}</div>
                      <div class="dropSub">{{ detectText.dropSub }}</div>

                      <button class="btn" type="button" @click.stop="pickFile">
                      <span>{{ detectText.dropBtn }}</span><span aria-hidden="true">↗</span>
                      </button>
                  </div>
            </div>


            <div class="status">
              <span>{{ statusText }}</span>
              <div class="progress" aria-label="progress">
                <i :style="{width: progress + '%'}"></i>
              </div>
              <span>{{ timeCostText }}</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Right -->
      <div class="card">
        <div class="hd">
          <div>
            <h2 class="title">{{ detectText.resultTitle }}</h2>
            <p class="sub">{{ detectText.resultSub }}</p>
          </div>
          <div class="taskTabs">
            <button
              v-for="tab in taskTabs"
              :key="tab.key"
              class="taskTab"
              :class="{ active: activeTask === tab.key }"
              type="button"
              @click="switchTask(tab.key)"
            >
              <span class="dot" :class="taskDotClass(tab.key)"></span>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </div>
        <div class="bd">
          <div class="kpi">
            
            <div class="box">
              <small>
                <template v-if="lang==='en'">Risk<br/>level</template>
                <template v-else>{{ detectText.kpiRisk }}</template>
              </small>
              <b class="kpiValue" :class="riskValueClass">{{ kpiRisk }}</b>
            </div>

            <div class="box">
              <small>{{ detectText.kpiConfidence }}</small>
              <b class="kpiValue kpiPercent">{{ kpiConfidence }}</b>
            </div>

            <div class="box" v-if="activeTask === 'tamper'">
              <small>{{ detectText.kpiArea }}</small>
              <b class="kpiValue kpiPercent">{{ kpiArea }}</b>
            </div>

          </div>

          <div style="margin-top:14px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
              <b style="font-size:13px">{{ reasonsTitleText }}</b>
              <span class="badge">{{ reasons.length }} {{ detectText.reasonCountLabel }}</span>
            </div>
            <div class="list">
              <div v-if="reasons.length===0" class="item">
                <div class="left">
                  <div class="dot"></div>
                  <div><b>{{ detectText.reasonEmptyTitle }}</b><span>{{ detectText.reasonEmptyDesc }}</span></div>
                </div>
              </div>
              <div v-for="(r, idx) in reasons" :key="'r'+idx" class="item">
                <div class="left">
                  <div class="dot" :class="dotClass(r.severity)"></div>
                  <div>
                    <b>{{ r.title }} <code v-if="r.tag">{{ r.tag }}</code></b>
                    <span>{{ r.detail || detectText.defaults.dash }}</span>
                  </div>
                </div>
                <code v-if="r.value">{{ r.value }}</code>
              </div>
            </div>
          </div>

          
          <div style="margin-top:14px" :key="lang">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
              <b style="font-size:13px">{{ historyTitleText }}</b>
              <span class="badge">{{ historyAll.length }}</span>
            </div>

            <!-- ✅ 卡片式历史 + 滚动分页加载 -->
            <div ref="historyScrollEl" class="historyCards" @scroll.passive="onHistoryScroll">
              <div v-if="historyView.length===0 && !historyLoading" class="hint">
                {{ detectText.historyEmpty }}
              </div>

              <div v-for="h in historyView" :key="h.id" class="hisCard" @click="loadHistory(h)">
                <img :src="h.thumb" alt="thumb" />
                <div class="hisMain">
                  <div class="hisTop">
                    <b class="hisName">{{ h.filename }}</b>
                    <span class="badge" :class="h.risk_level==='LOW'?'good':(h.risk_level==='MID'?'warn':'bad')">
                      {{ h.risk_level }}
                    </span>
                  </div>
                  <div class="hisSub">
                    <span>{{ formatTs(h.ts) }}</span>
                    <span class="sep">·</span>
                    <span class="conclusion">{{ h.conclusion }}</span>
                    <span class="sep">·</span>
                    <span>{{ detectText.historyConfidence }} {{ Math.round((h.confidence||0)*100) }}%</span>
                    <span class="sep" v-if="h.tamper_area_ratio != null">·</span>
                    <span v-if="h.tamper_area_ratio != null">{{ detectText.historyArea }} {{ Math.round((h.tamper_area_ratio||0)*100) }}%</span>
                  </div>
                </div>
                <button class="btn secondary hisBtn" type="button" @click.stop="loadHistory(h)">{{ detectText.historyViewBtn }}</button>
              </div>

              <div v-if="historyLoading" class="hisLoading">{{ detectText.historyLoading }}</div>
              <div v-else-if="!historyHasMore && historyView.length>0" class="hisEnd">{{ detectText.historyEnd }}</div>
            </div>
          </div>

          </div>
        </div>
      </div>
    </div>

    <div class="toast" :class="{show: toast.show}">
      <b>{{ toast.title }}</b>
      <span>{{ toast.msg }}</span>
    </div>

</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { useI18n } from './i18n'

const API_URL = '/api/detect'

const { dict, t, lang } = useI18n()
const commonText = computed(() => dict.value.common)
const detectText = computed(() => dict.value.detect)

const useMock = ref(false)
const dragging = ref(false)
const busy = ref(false)

const fileInputEl = ref(null)

const currentFile = ref(null)
const currentResult = ref(null)
const activeTask = ref('tamper')
const taskResults = reactive({
  tamper: makeEmptyTask({ includeArea: true }),
  ai: makeEmptyTask()
})

const imageUrl = ref('')
const heatmapUrl = ref('')
const showOverlay = ref(false)

const imgMeta = ref(detectText.value.defaults.imgMeta)
const statusKey = ref('waiting') // waiting | uploaded | sample | detecting | detectingMock | done | fail
const progress = ref(0)
const timeCostMs = ref(null)

const historyAll = ref([]) // 模拟“后端历史库”（接后端后用接口替代）
const historyView = ref([]) // 页面展示的分页结果
const historyPage = ref(1)
const historyLoading = ref(false)
const historyHasMore = ref(true)
const HISTORY_PAGE_SIZE = 6
const historyScrollEl = ref(null)


const toast = ref({ show:false, title: detectText.value.defaults.toastTitle, msg:'' })

const previewDragging = ref(false)

const statusText = computed(() => {
  const d = detectText.value.defaults
  switch(statusKey.value){
    case 'uploaded': return d.statusUploaded
    case 'sample': return d.statusSample
    case 'detectingMock': return d.statusDetectingMock
    case 'detecting': return d.statusDetecting
    case 'done': return d.statusDone
    case 'fail': return d.statusFail
    default: return d.statusWaiting
  }
})

const timeCostText = computed(() => {
  const d = detectText.value.defaults
  if (typeof timeCostMs.value === 'number') return d.timeCostFmt.replace('{ms}', Math.round(timeCostMs.value))
  return d.timeCostIdle
})

const taskTabs = computed(() => ([
  { key: 'ai', label: detectText.value.taskTabs?.ai || 'AI 伪造' },
  { key: 'tamper', label: detectText.value.taskTabs?.tamper || '局部篡改' }
]))

const currentTaskData = computed(() => taskResults[activeTask.value] || makeEmptyTask({ includeArea: activeTask.value === 'tamper' }))
const reasons = computed(() => currentTaskData.value.reasons || [])
const reasonsTitleText = computed(() => {
  if (activeTask.value === 'ai') return detectText.value.aiReasonsTitle || detectText.value.reasonsTitle
  return detectText.value.reasonsTitle
})

function makeEmptyTask({ includeArea = false } = {}){
  return { risk_level: '', confidence: null, tamper_area_ratio: includeArea ? null : null, heatmap: '', reasons: [] }
}

function switchTask(key){
  activeTask.value = key
}

function taskDotClass(taskKey){
  const lv = String(taskResults[taskKey]?.risk_level || '').toUpperCase()
  if (lv === 'LOW' || lv === 'PASS') return 'good'
  if (lv === 'MID' || lv === 'WARN') return 'warn'
  if (lv === 'HIGH' || lv === 'FAIL') return 'bad'
  return 'idle'
}

/* =====================
 * ✅ 检测历史：卡片展示 + 滚动分页加载（本地模拟）
 * ===================== */
function formatTs(ts){
  try{ return new Date(ts).toLocaleString() }catch{ return String(ts||'') }
}
function riskToConclusion(lv){
  const map = detectText.value.riskConclusion
  if (lv === 'HIGH') return map.HIGH
  if (lv === 'MID') return map.MID
  if (lv === 'LOW') return map.LOW
  return map.default
}

// 接后端后：把这里替换成 fetch(API) 分页查询
async function fetchHistoryPage(page, pageSize){
  await sleep(160)
  const sorted = historyAll.value.slice().sort((a,b)=> (b.ts||0) - (a.ts||0))
  const start = (page - 1) * pageSize
  return { rows: sorted.slice(start, start + pageSize), total: sorted.length }
}

async function loadMoreHistory(){
  if (historyLoading.value || !historyHasMore.value) return
  historyLoading.value = true
  try{
    const { rows, total } = await fetchHistoryPage(historyPage.value, HISTORY_PAGE_SIZE)
    historyView.value = historyView.value.concat(rows)
    historyHasMore.value = historyView.value.length < total
    historyPage.value += 1
  }finally{
    historyLoading.value = false
  }
}

function reloadHistory(){
  historyPage.value = 1
  historyHasMore.value = true
  historyView.value = []
  loadMoreHistory()
  requestAnimationFrame(()=>{ if(historyScrollEl.value) historyScrollEl.value.scrollTop = 0 })
}

function refreshHistoryLocale(){
  const sampleMap = Object.fromEntries((detectText.value.sampleMetas || []).map(m => [m.id, m]))
  historyAll.value = historyAll.value.map(h => ({
    ...h,
    filename: h.sampleId && sampleMap[h.sampleId] ? sampleMap[h.sampleId].title : h.filename,
    conclusion: riskToConclusion(h.risk_level)
  }))
}

function onHistoryScroll(e){
  const el = e?.target
  if (!el) return
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) loadMoreHistory()
}

// 新增一条历史并刷新第一页（用于：检测完成 / 点击样例）
function addHistoryRecord(rec){
  historyAll.value.push(rec)
  if (historyAll.value.length > 200) historyAll.value.splice(0, historyAll.value.length - 200)
  reloadHistory()
}


const riskValueClass = computed(() => {
  const lv = currentTaskData.value?.risk_level
  if (lv === 'LOW') return 'kpiGood'
  if (lv === 'MID') return 'kpiWarn'
  if (lv === 'HIGH') return 'kpiBad'
  return ''
})

// =====================
// ✅ 示例样本：点击后自动渲染结果（无需上传）
// =====================
const sampleItems = ref([])
const activeSampleId = ref('')
const sampleCountLabel = computed(() => detectText.value.sampleCount.replace('{count}', sampleItems.value.length))
const historyTitleText = computed(() => detectText.value.historyTitle)

function mulberry32(seed) {
  let t = seed >>> 0
  return function () {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function makeSampleDocImageDataUrl(title, lines = [], seed = 1) {
  const rnd = mulberry32(seed)
  const c = document.createElement('canvas')
  c.width = 1200
  c.height = 750
  const ctx = c.getContext('2d')

  // 背景（纸张）
  ctx.fillStyle = 'rgba(245,247,255,1)'
  ctx.fillRect(0, 0, c.width, c.height)

  // 纸张阴影
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fillRect(110, 70, 980, 610)
  ctx.fillStyle = 'rgba(255,255,255,1)'
  ctx.fillRect(100, 60, 980, 610)

  // 顶部浅色条
  ctx.fillStyle = 'rgba(16,31,58,0.06)'
  ctx.fillRect(100, 60, 980, 64)

  // 标题
  ctx.fillStyle = 'rgba(16,31,58,0.92)'
  ctx.font = 'bold 34px ui-sans-serif, system-ui, -apple-system'
  ctx.fillText(title, 140, 105)

  // 字段内容
  ctx.font = '16px ui-monospace, SFMono-Regular, Menlo, Monaco'
  ctx.fillStyle = 'rgba(16,31,58,0.75)'
  const baseY = 165
  const fallbackLines = (detectText.value.sampleMetas?.[0]?.lines) || [
    'Issue date: 2025-12-23',
    'Buyer: Demo Company',
    'Seller: Demo Trading',
    'Amount: ¥ 76,000.00',
    'Tax: ¥ 4,560.00',
    'Total: ¥ 80,560.00',
    'Note: sample only'
  ]
  const allLines = lines.length ? lines : fallbackLines
  allLines.forEach((t, i) => {
    ctx.fillText(t, 150, baseY + i * 42)
  })

  // 轻噪点（模拟扫描/压缩）
  const dots = 1400
  for (let i = 0; i < dots; i++) {
    const x = 110 + rnd() * 960
    const y = 140 + rnd() * 500
    const a = 0.03 + rnd() * 0.05
    ctx.fillStyle = `rgba(0,0,0,${a})`
    ctx.fillRect(x, y, 1, 1)
  }

  // 红色章（示意）
  ctx.save()
  ctx.translate(820, 500)
  ctx.rotate(-0.18)
  ctx.strokeStyle = 'rgba(220,40,40,0.35)'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.arc(0, 0, 110, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = 'rgba(220,40,40,0.10)'
  ctx.beginPath()
  ctx.arc(0, 0, 110, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  return c.toDataURL('image/jpeg', 0.92)
}

function makeHeatmapBase64Seeded(seed = 1) {
  const rnd = mulberry32(seed)
  const c = document.createElement('canvas')
  c.width = 1200
  c.height = 750
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, c.width, c.height)

  for (let i = 0; i < 14; i++) {
    const x = 200 + rnd() * 800
    const y = 120 + rnd() * 520
    const r = 50 + rnd() * 140
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(255,80,80,0.55)')
    g.addColorStop(1, 'rgba(255,80,80,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = 'rgba(255,80,80,0.38)'
  ctx.fillRect(730, 420, 290, 140)

  return c.toDataURL('image/png')
}

async function dataUrlToFile(dataUrl, filename) {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return new File([blob], filename, { type: blob.type || 'image/jpeg' })
}

function buildAiReasons(riskLevel){
  const aiMock = detectText.value.mockAiReasons || {}
  const fallback = [
    { title: '纹理统计异常', detail: '高级纹理分布不符自然机理样本。' },
    { title: '语义一致性异常', detail: '文字与背景逻辑不符，存在合成痕迹。' },
    { title: '扩散模型残留特征', detail: '检测到典型生成模型噪声模式。' }
  ]
  const items = [
    aiMock.pattern || fallback[0],
    aiMock.semantic || fallback[1],
    aiMock.model || fallback[2]
  ]
  return items.map((item, idx) => ({
    title: item.title || fallback[idx]?.title || detectText.value.reasonFallback,
    detail: item.detail || fallback[idx]?.detail || '',
    severity: normalizeSeverity(item.severity || (riskLevel === 'HIGH' ? 'FAIL' : 'WARN')),
    tag: item.tag || ''
  }))
}

function buildSampleResult({ risk_level, confidence, tamper_area_ratio, seed }) {
  const heatmap = makeHeatmapBase64Seeded(seed)
  const mReasons = detectText.value.mockReasons

  const rs = []
  if (risk_level !== 'LOW') {
    rs.push({ title: mReasons.tamper.title, detail: mReasons.tamper.detail, severity: 'FAIL' })
  } else {
    rs.push({ title: mReasons.clean.title, detail: mReasons.clean.detail, severity: 'PASS' })
  }
  rs.push({ title: mReasons.recompress.title, detail: mReasons.recompress.detail, severity: risk_level === 'HIGH' ? 'WARN' : 'PASS' })
  if (risk_level === 'HIGH') {
    rs.push({ title: mReasons.date.title, detail: mReasons.date.detail, severity: 'FAIL' })
  }

  const tamper = {
    risk_level,
    confidence,
    tamper_area_ratio,
    heatmap_base64: heatmap,
    reasons: rs
  }

  const aiRisk = risk_level === 'HIGH' ? 'HIGH' : (risk_level === 'MID' ? 'MID' : 'LOW')
  const aiConfidence = typeof confidence === 'number' ? Math.max(confidence, 0.82) : (aiRisk === 'HIGH' ? 0.91 : 0.85)
  const ai = { risk_level: aiRisk, confidence: aiConfidence, reasons: buildAiReasons(aiRisk) }

  return { tamper, ai }
}

async function initSamples() {
  const metas = detectText.value.sampleMetas || []
  const built = []
  for (const m of metas) {
    const img = makeSampleDocImageDataUrl(m.title, m.lines, m.seed)
    const thumb = await makeThumbFromDataUrl(img)
    built.push({ ...m, image: img, thumb })
  }
  sampleItems.value = built
}

onMounted(() => {
  initSamples()
  reloadHistory()
})

watch(lang, async () => {
  await initSamples()
  toast.value.title = detectText.value.defaults.toastTitle
  refreshHistoryLocale()
  reloadHistory()
  if (activeSampleId.value) {
    const active = sampleItems.value.find(s => s.id === activeSampleId.value)
    if (active) await applySample(active, { skipHistory: true })
  } else if (!currentFile.value && !imageUrl.value) {
    imgMeta.value = detectText.value.defaults.imgMeta
    statusKey.value = 'waiting'
  }
  if (!currentResult.value && !busy.value) {
    statusKey.value = 'waiting'
    timeCostMs.value = null
  }
})

async function applySample(s, { skipHistory = false } = {}) {
  activeSampleId.value = s.id

  // 不弹清空 toast，直接重置关键状态
  currentFile.value = null
  currentResult.value = null
  resetTaskResults()
  heatmapUrl.value = ''
  showOverlay.value = false
  progress.value = 100
  timeCostMs.value = null
  activeTask.value = 'tamper'

  // 用 dataUrl 作为预览图（不会出现裂图）
  imageUrl.value = s.image
  imgMeta.value = detectText.value.defaults.sampleMeta.replace('{title}', s.title)
  statusKey.value = 'sample'

  // 让“开始检测”可用（如你后续想用 API 再跑一次）
  try {
    currentFile.value = await dataUrlToFile(s.image, `${s.id}.jpg`)
  } catch {
    // ignore
  }

  // 自动渲染固定结果（热力图/风险/置信度/占比/解释）
  const result = buildSampleResult({
    risk_level: s.risk_level,
    confidence: s.confidence,
    tamper_area_ratio: s.area,
    seed: s.seed
  })
  const normalized = normalizeDetectionResult(result)
  applyResult(normalized)

    // ✅ 点击样例同时写入历史，便于你立刻看到“卡片效果”
    if (!skipHistory) {
    addHistoryRecord({
      id: crypto.randomUUID(),
      sampleId: s.id,
      ts: Date.now(),
      filename: s.title,
      confidence: normalized.tamper?.confidence ?? normalized.ai?.confidence ?? s.confidence ?? 0,
      risk_level: normalized.tamper?.risk_level ?? normalized.ai?.risk_level ?? s.risk_level ?? detectText.value.defaults.dash,
      conclusion: riskToConclusion(normalized.tamper?.risk_level ?? normalized.ai?.risk_level ?? s.risk_level ?? detectText.value.defaults.dash),
        tamper_area_ratio: normalized.tamper?.tamper_area_ratio ?? s.area ?? null,
        thumb: s.thumb,
        image: s.image,
        heatmap: heatmapUrl.value,
        raw: normalized
      })
    }

    if (!skipHistory) {
      showToast(detectText.value.defaults.sampleToastTitle, detectText.value.defaults.sampleToastDesc.replace('{title}', s.title).replace('{risk}', s.risk_level))
    }
}

let toastTimer = null

const apiChip = computed(() => useMock.value ? detectText.value.apiChipMock : t('detect.apiChipReal', { api: API_URL }))

const kpiRisk = computed(() => currentTaskData.value?.risk_level || detectText.value.defaults.dash)
const kpiConfidence = computed(() => {
  const c = currentTaskData.value?.confidence
  return typeof c === 'number' ? `${Math.round(c*100)}%` : detectText.value.defaults.dash
})
const kpiArea = computed(() => {
  const a = currentTaskData.value?.tamper_area_ratio
  if (typeof a !== 'number') return detectText.value.defaults.dash
  return `${(a*100).toFixed(1)}%`
})
const kpiAreaHint = computed(() => {
  const a = currentTaskData.value?.tamper_area_ratio
  if (typeof a !== 'number') return detectText.value.defaults.needHeatmap
  return a > 0.08 ? detectText.value.defaults.areaHigh : detectText.value.defaults.areaLow
})

const riskBadgeClass = computed(() => {
  const lv = currentTaskData.value?.risk_level
  if (lv === 'LOW') return 'good'
  if (lv === 'MID') return 'warn'
  if (lv === 'HIGH') return 'bad'
  return ''
})
const riskBadgeText = computed(() => {
  const lv = currentTaskData.value?.risk_level
  return lv ? detectText.value.defaults.riskPrefix.replace('{level}', lv) : detectText.value.defaults.riskEmpty
})

function showToast(title, msg){
  toast.value = { show:true, title: title || detectText.value.defaults.toastTitle, msg }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, 3200)
}

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
  revokeObjectUrls()
})

function revokeObjectUrls(){
  if (imageUrl.value?.startsWith('blob:')) URL.revokeObjectURL(imageUrl.value)
  // heatmap may be base64, do not revoke
}

function toggleMock(){
  useMock.value = !useMock.value
  showToast(detectText.value.defaults.modeSwitched, useMock.value ? detectText.value.defaults.modeSwitchedMock : detectText.value.defaults.modeSwitchedApi)
}

function pickFile(){
  fileInputEl.value?.click()
}

function onInputChange(e){
  const f = e.target.files?.[0]
  if (f) onFileSelected(f)
}

function onDragEnter(){
  dragging.value = true
}
function onDragLeave(){
  dragging.value = false
}
function onDrop(e){
  dragging.value = false
  const f = e.dataTransfer.files?.[0]
  if (f) onFileSelected(f)
}

function formatBytes(bytes){
  const units = ['B','KB','MB','GB']
  let i = 0
  let v = bytes
  while(v >= 1024 && i < units.length-1){ v/=1024; i++; }
  return `${v.toFixed(v>=10||i===0?0:1)} ${units[i]}`
}

function onFileSelected(file){
  if (!file.type?.startsWith('image/')){
    showToast(detectText.value.defaults.invalidFile, detectText.value.defaults.invalidFileDesc)
    return
  }
  if (file.size > 10 * 1024 * 1024){
    showToast(detectText.value.defaults.largeFile, detectText.value.defaults.largeFileDesc)
  }

  revokeObjectUrls()

  currentFile.value = file
  currentResult.value = null
  resetTaskResults()
  activeTask.value = 'tamper'
  heatmapUrl.value = ''
  showOverlay.value = false

  imageUrl.value = URL.createObjectURL(file)
  imgMeta.value = `${file.name} · ${formatBytes(file.size)}`
  statusKey.value = 'uploaded'
  progress.value = 0
  timeCostMs.value = null
}

function clearAll(){
  currentFile.value = null
  currentResult.value = null
  resetTaskResults()
  imgMeta.value = detectText.value.defaults.imgMeta
  statusKey.value = 'waiting'
  progress.value = 0
  timeCostMs.value = null
  heatmapUrl.value = ''
  showOverlay.value = false
  activeTask.value = 'tamper'
  revokeObjectUrls()
  imageUrl.value = ''
  if (fileInputEl.value) fileInputEl.value.value = ''
  showToast(detectText.value.defaults.cleared, detectText.value.defaults.clearedDesc)
}

function toggleOverlay(){
  if (!heatmapUrl.value){
    showToast(detectText.value.defaults.noHeatmap, detectText.value.defaults.noHeatmapDesc)
    return
  }
  showOverlay.value = true
}

function dotClass(status){
  const s = String(status||'').toUpperCase()
  if (['PASS','OK','TRUE','SUCCESS','LOW'].includes(s)) return 'good'
  if (['WARN','MAYBE','MID'].includes(s)) return 'warn'
  if (['FAIL','FALSE','ERROR','HIGH','BAD'].includes(s)) return 'bad'
  return ''
}

function normalizeSeverity(s){
  s = String(s||'').toUpperCase()
  if (['PASS','OK','LOW'].includes(s)) return 'PASS'
  if (['WARN','MID'].includes(s)) return 'WARN'
  if (['FAIL','HIGH','BAD'].includes(s)) return 'FAIL'
  return 'WARN'
}

function normalizeReasons(list){
  return (list || []).map(r => ({
    title: r.title || r.reason || detectText.value.reasonFallback,
    detail: r.detail || r.desc || r.message || '',
    severity: normalizeSeverity(r.severity || r.level || ''),
    tag: r.tag || r.field || '',
    value: r.value || ''
  }))
}

function normalizeTaskResult(src, { includeArea = false } = {}){
  const area = includeArea
    ? (typeof src?.tamper_area_ratio === 'number'
      ? src.tamper_area_ratio
      : (typeof src?.area_ratio === 'number' ? src.area_ratio : null))
    : null
  return {
    risk_level: src?.risk_level || src?.risk || '',
    confidence: typeof src?.confidence === 'number' ? src.confidence : null,
    tamper_area_ratio: area,
    heatmap: src?.heatmap_base64 || src?.heatmap_url || src?.heatmap || '',
    reasons: normalizeReasons(src?.reasons || [])
  }
}

function normalizeDetectionResult(result){
  const aiSrc = result?.ai || result?.ai_result || result?.aiForgery || result?.ai_forgery || result?.ai_detection || result?.aiDetect
  const tamperSrc = result?.tamper || result?.tamper_result || result
  const rawOriginal = result?.raw ?? result
  return {
    tamper: normalizeTaskResult(tamperSrc || {}, { includeArea: true }),
    ai: normalizeTaskResult(aiSrc || {}, { includeArea: false }),
    raw: rawOriginal
  }
}

function resetTaskResults(){
  taskResults.tamper = makeEmptyTask({ includeArea: true })
  taskResults.ai = makeEmptyTask()
}

function rand(a,b){ return a + Math.random()*(b-a) }
function sleep(ms){ return new Promise(r => setTimeout(r, ms)) }

function makeFakeHeatmapBase64(){
  const c = document.createElement('canvas')
  c.width = 1200; c.height = 750
  const ctx = c.getContext('2d')
  ctx.clearRect(0,0,c.width,c.height)
  for(let i=0;i<16;i++){
    const x = rand(200, 1000), y = rand(120, 630)
    const r = rand(40, 160)
    const g = ctx.createRadialGradient(x,y,0,x,y,r)
    g.addColorStop(0, 'rgba(255,80,80,0.55)')
    g.addColorStop(1, 'rgba(255,80,80,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x,y,r,0,Math.PI*2)
    ctx.fill()
  }
  ctx.fillStyle = 'rgba(255,80,80,0.40)'
  ctx.fillRect(740, 430, 260, 120)
  return c.toDataURL('image/png')
}

function buildMockResult(){
  const risk = ['LOW','MID','HIGH'][Math.floor(Math.random()*3)]
  const conf = risk==='LOW' ? rand(0.70,0.92) : (risk==='MID' ? rand(0.62,0.86) : rand(0.72,0.95))
  const area = risk==='LOW' ? rand(0.005,0.03) : (risk==='MID' ? rand(0.02,0.09) : rand(0.08,0.22))
  const heatmap = makeFakeHeatmapBase64()
  const mReasons = detectText.value.mockReasons

  const rs = []
  if(risk !== 'LOW') rs.push({ title: mReasons.tamper.title, detail: mReasons.tamper.detail, severity:'FAIL' })
  else rs.push({ title: mReasons.clean.title, detail: mReasons.clean.detail, severity:'PASS' })
  rs.push({ title: mReasons.recompress.title, detail: mReasons.recompress.detail, severity: risk==='HIGH'?'WARN':'PASS' })
  if(risk === 'HIGH') rs.push({ title: mReasons.date.title, detail: mReasons.date.detail, severity:'FAIL' })

  const tamper = { risk_level:risk, confidence:conf, tamper_area_ratio:area, heatmap_base64:heatmap, reasons:rs }

  const aiRisk = ['LOW','MID','HIGH'][Math.floor(Math.random()*3)]
  const aiConf = aiRisk==='LOW' ? rand(0.78,0.9) : (aiRisk==='MID' ? rand(0.8,0.93) : rand(0.88,0.96))
  const ai = { risk_level: aiRisk, confidence: aiConf, reasons: buildAiReasons(aiRisk) }

  return { tamper, ai }
}

async function makeThumbFromDataUrl(dataUrl){
  const img = new Image()
  img.src = dataUrl
  await img.decode().catch(()=>{})
  const c = document.createElement('canvas')
  const w = 160, h = 160
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  const iw = img.naturalWidth || 800
  const ih = img.naturalHeight || 600
  const scale = Math.max(w/iw, h/ih)
  const sw = w/scale, sh = h/scale
  const sx = (iw - sw)/2, sy = (ih - sh)/2
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
  return c.toDataURL('image/jpeg', 0.82)
}

function applyResult(result){
  const normalized = normalizeDetectionResult(result)
  taskResults.tamper = normalized.tamper
  taskResults.ai = normalized.ai
  currentResult.value = normalized

  const hm = normalized.tamper.heatmap
  heatmapUrl.value = hm || ''
  if (!hm && statusKey.value === 'done') showToast(detectText.value.defaults.toastTitle, detectText.value.defaults.noHeatmapDesc)
}

async function detect(){
  if (!currentFile.value){
    showToast(detectText.value.defaults.noUploadTitle, detectText.value.defaults.noUploadDesc)
    return
  }
  busy.value = true
  statusKey.value = useMock.value ? 'detectingMock' : 'detecting'
  timeCostMs.value = null
  progress.value = 8
  const t0 = performance.now()

  try{
    let result
    if (useMock.value){
      await sleep(260); progress.value = 22
      await sleep(220); progress.value = 40
      await sleep(240); progress.value = 62
      await sleep(260); progress.value = 80
      result = buildMockResult()
    }else{
      const form = new FormData()
      form.append('file', currentFile.value)
      const resp = await fetch(API_URL, { method:'POST', body: form })
      if (!resp.ok){
        const text = await resp.text().catch(()=> '')
        const extra = text ? ' - ' + text.slice(0,180) : ''
        throw new Error(detectText.value.defaults.apiError.replace('{status}', resp.status).replace('{statusText}', resp.statusText).replace('{extra}', extra))
      }
      result = await resp.json()
    }

    progress.value = 96
    const t1 = performance.now()
    timeCostMs.value = Math.round(t1 - t0)

    const normalized = normalizeDetectionResult(result)
    applyResult(normalized)

    // save history
      const thumb = await makeThumbFromDataUrl(imageUrl.value)
      const primaryTask = normalized.tamper?.risk_level ? normalized.tamper : normalized.ai
      addHistoryRecord({
        id: crypto.randomUUID(),
        ts: Date.now(),
        filename: currentFile.value.name,
        confidence: primaryTask?.confidence ?? 0,
        risk_level: primaryTask?.risk_level ?? detectText.value.defaults.dash,
        conclusion: riskToConclusion(primaryTask?.risk_level ?? detectText.value.defaults.dash),
        tamper_area_ratio: normalized.tamper?.tamper_area_ratio ?? null,
        thumb,
        image: imageUrl.value,
        heatmap: heatmapUrl.value,
        raw: normalized
      })

    progress.value = 100
    statusKey.value = 'done'
    showToast(detectText.value.defaults.detectDoneTitle, detectText.value.defaults.detectDoneDesc)
  }catch(e){
    console.error(e)
    const extra = e?.message || detectText.value.defaults.detectFailUnknown
    showToast(detectText.value.defaults.detectFailTitle, extra)
    statusKey.value = 'fail'
    progress.value = 0
    timeCostMs.value = null
  }finally{
    busy.value = false
  }
}

function downloadJson(){
  if(!currentResult.value){
    showToast(detectText.value.defaults.noResultTitle, detectText.value.defaults.noResultDesc)
    return
  }
  const blob = new Blob([JSON.stringify(currentResult.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'detect_result.json'
  a.click()
  URL.revokeObjectURL(url)
  showToast(detectText.value.defaults.exportedTitle, detectText.value.defaults.exportedDesc)
}

function loadHistory(h){
  // restore preview & result
  imageUrl.value = h.image
  heatmapUrl.value = h.heatmap || ''
  currentResult.value = h.raw
  applyResult(h.raw)
  statusKey.value = 'done'
  timeCostMs.value = null
  showToast(detectText.value.defaults.historyLoadedTitle, detectText.value.defaults.historyLoadedDesc)
}

function onPreviewClick() {
// 有图时点击不强制打开文件选择（避免误触），你也可以改成总是打开
if (!imageUrl.value) pickFile()
}

function onPreviewDragEnter() {
previewDragging.value = true
}
function onPreviewDragLeave() {
previewDragging.value = false
}
function onPreviewDrop(e) {
previewDragging.value = false
const f = e.dataTransfer.files?.[0]
if (f) onFileSelected(f)
}

// 支持 Ctrl+V 粘贴截图/图片
function onPreviewPaste(e) {
const items = e.clipboardData?.items || []
for (const it of items) {
  if (it.type?.startsWith('image/')) {
    const file = it.getAsFile()
    if (file) {
      onFileSelected(file)
      showToast(detectText.value.defaults.pasteTitle, detectText.value.defaults.pasteDesc)
    }
    return
  }
}
// 没粘贴到图片就不提示也行；你想提示就打开下面一行
// showToast('未检测到图片', '请复制图片后再 Ctrl+V。')
}

</script>

<style scoped>
.taskTabs{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
}
.taskTab{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:6px 10px;
  border:1px solid rgba(122,162,255,0.30);
  border-radius:12px;
  background: rgba(122,162,255,0.06);
  font-size:12px;
  color:#112;
  cursor:pointer;
  transition: all .15s ease;
}
.taskTab .dot{
  width:9px;
  height:9px;
  border-radius:50%;
  display:inline-block;
}
.taskTab .dot.good{ background:#2cbe4e; }
.taskTab .dot.warn{ background:#e0a800; }
.taskTab .dot.bad{ background:#e55353; }
.taskTab .dot.idle{ background:#c8d1e5; }
.taskTab.active{
  border-color: rgba(122,162,255,0.65);
  background: rgba(122,162,255,0.14);
  box-shadow: 0 0 0 1px rgba(122,162,255,0.12) inset;
}
</style>
