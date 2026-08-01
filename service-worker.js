/* 高考帮 Service Worker - 离线缓存 */
const CACHE_NAME = 'bidaikeu-v3'
// 核心资源（必缓存，应用可用性）
const CORE_ASSETS = [
  './index.html',
  './manifest.json',
  './lib/vue.global.prod.js',
  './lib/vant.min.js',
  './lib/vant.css',
  './data/universities.json',
  './data/tests.json',
]
// 大数据文件（后台缓存，离线时也可用）
const DATA_ASSETS = [
  './data/admissions.json',
  './data/satisfaction.json',
  './data/posts.json',
  './data/rank_2023.json',
  './data/rank_2024.json',
  './data/rank_2025.json',
  './data/score_segments.json',
  './data/fake_universities.json',
  './data/official_names.json',
  './data/policies.json',
  './data/major_rankings.json',
  './data/careers.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
]

// 安装：预缓存核心资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// 激活：清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// 获取：缓存优先，网络回退
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  // 只处理同源请求
  if (url.origin !== location.origin) return
  // API请求不缓存
  if (url.pathname.includes('/api/')) return

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached
      return fetch(e.request).then((response) => {
        // 缓存成功的响应
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone))
        }
        return response
      }).catch(() => {
        // 离线且未缓存：返回index.html（SPA回退）
        if (e.request.mode === 'navigate') return caches.match('./index.html')
      })
    })
  )
})
