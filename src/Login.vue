<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="brand login"><div class="logo" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l8.5 4.8v10.4L12 22l-8.5-4.8V6.8L12 2z" stroke="currentColor" stroke-width="1.6"/>
          <path d="M12 7v10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M7.6 12h8.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </div>
      <h2>{{ loginText.title }}</h2></div>
      <form class="form" @submit.prevent="onLogin">
        <label>{{ loginText.username }}</label>
        <input v-model="username" autocomplete="username" placeholder="root" />
        <label>{{ loginText.password }}</label>
        <input v-model="password" type="password" autocomplete="current-password" placeholder="Root@123" />
        <button class="btn login-btn" type="submit">{{ loginText.submit }}</button>
        <p v-if="error" class="err-tip">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from './i18n'
const { dict } = useI18n()
const loginText = computed(() => dict.value.login)

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function onLogin(){
  if(username.value === 'root' && password.value === 'Root@123'){
    error.value = ''
    router.push('/detect')
  }else{
    error.value = loginText.value.error
  }
}
</script>

<style scoped>
.login-wrap{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:48px 18px;
  position:relative;
}

/* Card: theme-aware (dark uses var(--card), light gets a glassy surface) */
.login-card{
  width: 390px;
  max-width: calc(100vw - 36px);
  padding: 44px 40px 34px;
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

[data-theme="light"] .login-card{
  background: rgba(255,255,255,.72);
  border-color: rgba(231,235,245,.90);
  box-shadow: 0 22px 70px rgba(15,23,42,.14);
  backdrop-filter: blur(18px);
}

.brand.login{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
  margin-bottom: 22px;
}

.logo{
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display:flex;
  align-items:center;
  justify-content:center;
  color: var(--primary2);
  background: rgba(122,162,255,.10);
  border: 1px solid rgba(122,162,255,.22);
  box-shadow: 0 10px 26px rgba(0,0,0,.16);
}

[data-theme="light"] .logo{
  background: rgba(47,91,255,.10);
  border-color: rgba(47,91,255,.22);
  box-shadow: 0 14px 34px rgba(15,23,42,.10);
}

.login-card h2{
  margin:0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: .3px;
  color: var(--text);
}

.form{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.form label{
  font-size: 13px;
  color: var(--muted);
  margin-top: 10px;
}

.form input{
  width:100%;
  padding: 12px 13px;
  border-radius: 12px;
  font-size: 15px;
  color: var(--text);
  background: var(--card2);
  border: 1px solid var(--border);
  transition: box-shadow .14s ease, border-color .14s ease, transform .14s ease;
}

[data-theme="light"] .form input{
  background: rgba(255,255,255,.90);
  border-color: rgba(231,235,245,.95);
}

.form input:focus{
  outline: none;
  border-color: var(--primary2);
  box-shadow: 0 0 0 4px rgba(47,91,255,.18);
}

.form input::placeholder{
  color: rgba(148,163,184,.9);
}

.login-btn{
  margin-top: 18px;
  width: 100%;
  border-radius: 999px;
  padding: 12px 14px;
  display: flex;
  align-items: center;        /* 垂直居中 */
  justify-content: center;    /* 水平居中 */
}


/* helper links / hint blocks if present */
.hint{
  margin-top: 14px;
  font-size: 12.5px;
  color: var(--muted);
  text-align:center;
}

</style>