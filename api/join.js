export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, squad, github } = req.body || {};
  if (!name || !email || !squad) {
    return res.status(400).json({ error: '缺少必填欄位' });
  }

  const body = [
    `### 加入申請`,
    `| 欄位 | 內容 |`,
    `|------|------|`,
    `| 姓名 | ${name} |`,
    `| Email | ${email} |`,
    `| 負責 Squad | ${squad} |`,
    `| GitHub 帳號 | ${github || '尚無，需申請'} |`,
    ``,
    `> 申請時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`,
  ].join('\n');

  const r = await fetch('https://api.github.com/repos/Fuyo0426/autoarch-opensource/issues', {
    method: 'POST',
    headers: {
      Authorization: `token ${process.env.GH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `[加入申請] ${name} — ${squad}`,
      body,
      labels: ['加入申請'],
    }),
  });

  if (!r.ok) {
    const err = await r.text();
    return res.status(500).json({ error: err });
  }

  return res.status(200).json({ ok: true });
}
