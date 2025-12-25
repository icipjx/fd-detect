<template>
  <div class="home-wrap">
    <div class="topbar home">
      <div class="brand">
        <div class="logo" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l8.5 4.8v10.4L12 22l-8.5-4.8V6.8L12 2z" stroke="currentColor" stroke-width="1.6"/>
            <path d="M12 7v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M7.6 12h8.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <h1>{{ homeText.heroTitle }}</h1>
          <p>{{ homeText.heroDesc }}</p>
        </div>
      </div>
    </div>
    <div class="home-main-card">
      <h2>{{ homeText.welcome }}</h2>
      <ul class="home-brief-list">
        <li v-for="(b, idx) in homeText.bullets" :key="idx">{{ b }}</li>
      </ul>
      <router-link to="/login" class="btn home-btn">{{ homeText.cta }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from './i18n'
const { dict } = useI18n()
const homeText = computed(() => dict.value.home)
</script>

<style scoped>
.home-wrap{min-height:100vh;padding:38px 0;}
.topbar.home{box-shadow:none;position:static;background:none;border:none;}
.home-main-card{
  max-width:460px;margin:48px auto 0 auto;
  padding:44px 32px 32px; border-radius:var(--radius);
  background: var(--card);box-shadow:var(--shadow);
  border:1px solid var(--border);text-align:center;
}
.home-main-card h2{font-size:20px;margin-bottom:18px;}
.home-brief-list{list-style:none;padding:0;margin:0 0 28px 0;text-align:left;}
.home-brief-list li{font-size:15px;color:var(--text);padding:8px 0;}
.home-btn{display:inline-block;font-size:16px;padding:12px 28px;margin-top:12px;}

/* Theme-friendly logo color */
.logo{color: var(--primary);}

/* Home card: use theme variables (dark stays dark via --card) */
.home-main-card{
  background: var(--card);
  border-color: var(--border);
  box-shadow: var(--shadow);
}

/* Light mode: match "glass / premium" feel like Login */
[data-theme="light"] .home-main-card{
  background: rgba(255,255,255,.72);
  border: 1px solid rgba(231,235,245,.88);
  box-shadow: 0 22px 70px rgba(15,23,42,.14);
  backdrop-filter: blur(16px);
}

/* Ensure CTA text stays centered */
.home-btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

</style>
