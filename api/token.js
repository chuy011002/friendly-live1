const crypto = require('crypto');

function packUint16(x) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(x, 0);
  return b;
}
function packUint32(x) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(x, 0);
  return b;
}
function packString(s) {
  return Buffer.concat([packUint16(Buffer.byteLength(s)), Buffer.from(s)]);
}
function packMapUint32(map) {
  const keys = Object.keys(map).map(Number).sort((a,b)=>a-b);
  let buf = packUint16(keys.length);
  for (const k of keys) {
    buf = Buffer.concat([buf, packUint16(k), packUint32(map[k])]);
  }
  return buf;
}

module.exports = function handler(req, res) {
  try {
    const channel = req.query.channel || 'live_principal';
    const uid = parseInt(req.query.uid) || 0;
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      return res.status(500).json({ error: 'Faltan AGORA_APP_ID o AGORA_APP_CERTIFICATE en Vercel' });
    }

    const issueTs = Math.floor(Date.now() / 1000);
    const expireTs = issueTs + 3600;
    const salt = Math.floor(Math.random() * 99999999) + 1;

    // 1=join, 2=audio, 3=video, 4=data
    const privileges = { 1: expireTs, 2: expireTs, 3: expireTs, 4: expireTs };

    const msg = Buffer.concat([
      packString(appId),
      packUint32(issueTs),
      packUint32(salt),
      packUint32(expireTs),
      packString(channel),
      packUint32(uid),
      packMapUint32(privileges)
    ]);

    const signature = crypto.createHmac('sha256', appCertificate).update(msg).digest();

    const content = Buffer.concat([
      signature,
      packUint32(issueTs),
      packUint32(salt),
      packUint32(expireTs),
      packMapUint32(privileges)
    ]);

    const token = '006' + appId + content.toString('base64');
    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
