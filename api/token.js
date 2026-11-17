import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export default function handler(req, res) {
  const channel = req.query.channel || 'live_principal';
  const uid = parseInt(req.query.uid) || 0;
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channel, uid, RtcRole.PUBLISHER, Math.floor(Date.now()/1000)+3600);
  res.status(200).json({ token });
}
