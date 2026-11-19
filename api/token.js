const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

module.exports = function handler(req, res) {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    return res.status(500).json({ error: 'Faltan AGORA_APP_ID o AGORA_APP_CERTIFICATE en Vercel' });
  }

  const channel = req.query.channel || 'live_principal';
  let uid = req.query.uid || '0';
  uid = parseInt(uid, 10) || 0;

  const expireTime = Math.floor(Date.now() / 1000) + 3600;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channel,
    uid,
    RtcRole.PUBLISHER,
    expireTime
  );

  return res.status(200).json({ token, appId, uid, channel });
};
