import express from 'express';
import { getUser, getRequestToken, getAccessToken, getIdentity, addToWantlist } from '../services/discogs.js';

const router = express.Router();

router.get('/users/:userName', async (req, res) => {
  const userName = req.params.userName;

  try {
    const data = await getUser(userName);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
});

router.get('/oauth/request_token', async (req, res) => {
  const chromeRuntimeId = req.query.chromeRuntimeId;

  try {
    const data = await getRequestToken(chromeRuntimeId);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
});

router.post('/oauth/access_token', async (req, res) => {
  const { requestToken, requestTokenSecret, oauthVerifier } = req.body;

  try {
    const data = await getAccessToken(requestToken, requestTokenSecret, oauthVerifier);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
});

router.get('/oauth/identity', async (req, res) => {
  const accessToken = req.query.accessToken;
  const accessTokenSecret = req.query.accessTokenSecret;

  if (!accessToken || !accessTokenSecret) {
    return res.status(400).json({ error: 'Missing access tokens' });
  };

  try {
    const data = await getIdentity(accessToken, accessTokenSecret);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
});

router.put('/users/:userName/wants/:releaseId', async (req, res) => {
  const userName = req.params.userName;
  const releaseId = req.params.releaseId;
  const { accessToken, accessTokenSecret } = req.body;

  if (!accessToken || !accessTokenSecret) {
    return res.status(400).json({ error: 'Missing access tokens' });
  };

  try {
    const data = await addToWantlist(accessToken, accessTokenSecret, userName, releaseId);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
});

export default router;
