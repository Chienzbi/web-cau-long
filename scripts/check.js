// Kiểm tra index.html trước khi triển khai (không cần cài thư viện):
//  1. Mỗi thẻ <script> nội tuyến phải biên dịch được (không lỗi cú pháp).
//  2. Mọi $('id') trong script phải có phần tử id="..." tương ứng trong HTML.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', process.argv[2] || 'index.html');
const html = fs.readFileSync(file, 'utf8');
const errors = [];

const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
if (!scripts.length) errors.push('Không tìm thấy thẻ <script> nội tuyến.');
scripts.forEach((m, i) => {
  try { new Function(m[1]); } catch (e) { errors.push(`Script #${i + 1} lỗi cú pháp: ${e.message}`); }
});

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
const used = new Set(scripts.flatMap(m => [...m[1].matchAll(/\$\('([A-Za-z0-9_-]+)'\)/g)].map(x => x[1])));
for (const id of used) if (!ids.has(id)) errors.push(`Script gọi $('${id}') nhưng HTML không có id="${id}".`);

if (errors.length) {
  console.error(errors.map(e => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${path.basename(file)}: ${scripts.length} script hợp lệ, ${used.size} id được tham chiếu đều tồn tại.`);
