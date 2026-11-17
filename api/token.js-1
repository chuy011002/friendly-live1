const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

module.exports = function handler(req, res) {
  try {
    const channel = req.query.channel || 'live_principal';
    const uid = parseInt(req.query.uid) || 0;
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      return res.status(500).json({ error: 'Faltan AGORA_APP_ID o AGORA_APP_CERTIFICATE en Vercel' });
    }

    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channel, uid, RtcRole.PUBLISHER, Math.floor(Date.now()/1000) + 3600);
    return res.status(200).json({ token });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
