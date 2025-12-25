<template>
  <label class="lang-switcher">
    <span class="label">{{ labels.language }}</span>
    <select v-model="current" aria-label="language switcher">
      <option value="zh">{{ labels.zh }}</option>
      <option value="en">{{ labels.en }}</option>
    </select>
  </label>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n'

const { lang, setLang, dict } = useI18n()

const labels = computed(() => dict.value.common)
const current = computed({
  get: () => lang.value,
  set: (val) => setLang(val)
})
</script>

<style scoped>
.lang-switcher{
  display:flex;
  align-items:center;
  gap:8px;
  padding:6px 10px;
  border:1px solid var(--border);
  border-radius:999px;
  background:rgba(16,31,58,.55);
  color:var(--muted);
  font-size:12px;
  box-shadow:0 6px 18px rgba(0,0,0,.18);
}
.lang-switcher select{
  background:rgba(16,31,58,.8);
  color:var(--text);
  border:1px solid var(--border);
  border-radius:10px;
  padding:6px 10px;
  font-size:12px;
}
.lang-switcher select:focus{outline:1px solid var(--primary2)}
</style>
