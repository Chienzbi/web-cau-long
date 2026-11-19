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

// 3. data.json (dữ liệu giải công khai) phải đọc được và các tham chiếu id phải khớp.
const dataFile = path.join(__dirname, '..', 'data.json');
if (fs.existsSync(dataFile)) {
  try {
    const d = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    for (const k of ['players', 'teams', 'matches']) if (!Array.isArray(d[k])) errors.push(`data.json thiếu mảng "${k}".`);
    if (!errors.length) {
      const pid = new Set(d.players.map(p => p.id)), tid = new Set(d.teams.map(t => t.id));
      for (const t of d.teams) for (const p of [t.maleId, t.femaleId, t.secondMaleId]) if (p && !pid.has(p)) errors.push(`Đội ${t.id} tham chiếu VĐV không tồn tại: ${p}`);
      for (const m of d.matches) for (const t of [m.aId, m.bId]) if (!tid.has(t)) errors.push(`Trận ${m.id} tham chiếu đội không tồn tại: ${t}`);
      console.log(`✓ data.json: ${d.players.length} VĐV, ${d.teams.length} đội, ${d.matches.length} trận.`);
    }
  } catch (e) { errors.push('data.json không đọc được: ' + e.message); }
}

// 4. manifest.webmanifest (cài lên màn hình chính): JSON hợp lệ, icon và sw.js tồn tại.
const root = path.join(__dirname, '..');
if (fs.existsSync(path.join(root, 'manifest.webmanifest'))) {
  try {
    const mf = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
    for (const ic of mf.icons || []) if (!fs.existsSync(path.join(root, ic.src))) errors.push(`manifest tham chiếu icon không tồn tại: ${ic.src}`);
    if (!fs.existsSync(path.join(root, 'sw.js'))) errors.push('Thiếu sw.js.');
    console.log(`✓ manifest: ${(mf.icons || []).length} icon, sw.js có mặt.`);
  } catch (e) { errors.push('manifest.webmanifest không đọc được: ' + e.message); }
}

if (errors.length) {
  console.error(errors.map(e => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ ${path.basename(file)}: ${scripts.length} script hợp lệ, ${used.size} id được tham chiếu đều tồn tại.`);
