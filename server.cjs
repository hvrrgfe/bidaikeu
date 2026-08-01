// 高考帮静态服务器
const http = require('http')
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
  console.log('========================================')
})
