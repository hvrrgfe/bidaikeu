// 高考帮静态服务器 + AI代理
const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const PORT = parseInt(process.argv[process.argv.indexOf('--port') + 1] || process.env.PORT || '3113', 10)
const ROOT = __dirname
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  // ===== AI 代理（解决浏览器CORS）=====
  // 请求体: { provider, model, messages } 或 { baseUrl, model, messages }
  if (req.url.startsWith('/api/ai') && req.method === 'POST') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const data = JSON.parse(body)
        // 从环境变量读Key（服务器持有Key模式），或从请求带Key
        const apiKey = data.apiKey || process.env.AI_API_KEY || ''
        const providerMap = {
          zhipu: { host: 'open.bigmodel.cn', path: '/api/paas/v4/chat/completions', model: 'glm-4.7-flash' },
          deepseek: { host: 'api.deepseek.com', path: '/v1/chat/completions', model: 'deepseek-chat' },
          qwen: { host: 'dashscope.aliyuncs.com', path: '/compatible-mode/v1/chat/completions', model: 'qwen-plus' },
          kimi: { host: 'api.moonshot.cn', path: '/v1/chat/completions', model: 'kimi-k2' },
          openai: { host: 'api.openai.com', path: '/v1/chat/completions', model: 'gpt-4o-mini' },
        }
        const prov = providerMap[data.provider]
        if (!prov) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: '未知provider' })); return }
        if (!apiKey) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: '未配置API Key（请求头或环境变量AI_API_KEY）' })); return }

        const payload = JSON.stringify({
          model: data.model || prov.model,
          messages: data.messages || [],
          temperature: 0.7,
        })
        const options = {
          hostname: prov.host, path: prov.path, method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey, 'Content-Length': Buffer.byteLength(payload) },
          timeout: 60000,
        }
        const proxyReq = https.request(options, proxyRes => {
          res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' })
          proxyRes.pipe(res)
        })
        proxyReq.on('error', e => { res.writeHead(502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: e.message })) })
        proxyReq.on('timeout', () => { proxyReq.destroy(); res.writeHead(504, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: '代理超时' })) })
        proxyReq.write(payload)
        proxyReq.end()
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'JSON解析失败' }))
      }
    })
    return
  }

  // ===== 静态文件 =====
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p === '/') p = '/index.html'
  const fp = path.join(ROOT, p)
  if (!fp.startsWith(ROOT)) { res.writeHead(403); res.end(); return }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream', 'Cache-Control': 'no-cache' })
    res.end(data)
  })
}).listen(PORT, '0.0.0.0', () => {
  console.log('========================================')
  console.log('  高考帮 · 志愿填报助手')
  console.log('  本地: http://localhost:' + PORT)
  console.log('  AI代理: /api/ai (智谱GLM免费等)')
  console.log('  环境变量 AI_API_KEY 可服务端持Key')
  console.log('========================================')
})
