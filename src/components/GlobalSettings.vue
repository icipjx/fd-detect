<template>
  <div class="global-settings">
    <button class="fab" @click="open = !open" :aria-expanded="open" :title="panelTitle">
      <span class="dot"></span>
      <span class="icon">☰</span>
    </button>
    <transition name="fade">
      <div v-if="open" class="panel" @click.stop>
        <div class="panel-hd">
          <span>{{ t('common.language') }} &amp; Theme</span>
          <button class="close" @click="open=false">×</button>
        </div>
        <div class="panel-section">
          <div class="label">{{ t('common.language') }}</div>
          <div class="option-row">
            <button :class="['chip', lang==='zh' && 'on']" @click="setLang('zh')">中文</button>
            <button :class="['chip', lang==='en' && 'on']" @click="setLang('en')">English</button>
          </div>
        </div>
        <div class="panel-section">
          <div class="label">Theme</div>
          <div class="option-row">
            <button :class="['chip', theme==='dark' && 'on']" @click="setTheme('dark')">Dark</button>
            <button :class="['chip', theme==='light' && 'on']" @click="setTheme('light')">Light</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from '../i18n'
import { useTheme } from '../theme'

const open = ref(false)
const { lang, setLang, t } = useI18n()
const { theme, setTheme } = useTheme()

const panelTitle = computed(() => `${t('common.language')} & Theme`)

const handleClickOutside = (e) => {
  if (!open.value) return
  const panel = e.target.closest('.global-settings')
  if (!panel) open.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(() => [lang.value, theme.value], () => {
  // close on change to reduce visual clutter
  open.value = false
})
</script>

<style scoped>
.global-settings{
  position:fixed;
  top:16px;
  right:16px;
  z-index:120;
}
.fab{
  width:42px;height:42px;border-radius:14px;border:1px solid var(--border);
  background:rgba(16,31,58,.7);
  box-shadow: var(--shadow);
  color:var(--text);
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:6px;
  transition:transform .12s ease, box-shadow .12s ease;
}
.fab:hover{transform:translateY(-1px); box-shadow:0 12px 24px rgba(0,0,0,.25);}
.dot{
  width:8px;height:8px;border-radius:50%;background:var(--primary2);
}
.panel{
  position:absolute;
  top:48px;
  right:0;
  width:240px;
  padding:14px;
  border-radius:16px;
  background:var(--card);
  border:1px solid var(--border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}
.panel-hd{
  display:flex;align-items:center;justify-content:space-between;
  font-size:13px;color:var(--text);margin-bottom:8px;
}
.close{
  background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;line-height:1;
}
.panel-section{margin-top:10px;}
.label{color:var(--muted);font-size:12px;margin-bottom:6px;}
.option-row{display:flex;gap:8px;}
.chip{
  flex:1 1 0;
  padding:8px 10px;
  border-radius:10px;
  border:1px solid var(--border);
  background:rgba(16,31,58,.45);
  color:var(--text);
  cursor:pointer;
}
.chip.on{
  border-color:var(--primary);
  background:rgba(90,123,255,.15);
  color:var(--primary);
  font-weight:600;
}
.fade-enter-active,.fade-leave-active{transition:opacity .12s ease;}
.fade-enter-from,.fade-leave-to{opacity:0;}

/* ===========================
   Theme polish for GlobalSettings
   =========================== */

/* Floating toggle button */
.fab{
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  color: var(--text);
}
.fab .dot{
  background: var(--primary);
}

/* Panel */
.panel{
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  color: var(--text);
}
.panel .title{ color: var(--text); }
.panel .sub{ color: var(--muted); }

/* Option buttons */
.opt{
  background: var(--card2);
  border: 1px solid var(--border);
  color: var(--text);
}
.opt.active{
  border-color: rgba(47,91,255,.32);
  background: rgba(47,91,255,.10);
}

/* Light: glass / premium */
[data-theme="light"] .fab{
  background: rgba(255,255,255,.70);
  border-color: rgba(231,235,245,.88);
  box-shadow: 0 18px 56px rgba(15,23,42,.14);
  backdrop-filter: blur(14px);
}
[data-theme="light"] .panel{
  background: rgba(255,255,255,.78);
  border-color: rgba(231,235,245,.88);
  box-shadow: 0 22px 70px rgba(15,23,42,.14);
  backdrop-filter: blur(18px);
}
[data-theme="light"] .opt{
  background: rgba(255,255,255,.86);
}

</style>
