const { getDomainMetrics } = require('../services/openPageRank');

exports.checkDomainMetrics = async (req, res, next) => {
  try {
    const { domain, urls } = req.body;
    const targetDomain = domain || (urls && urls[0]);

    if (!targetDomain) {
      return res.status(400).json({ status: 'error', message: 'Domain name or URL is required in request body.' });
    }

    const metrics = await getDomainMetrics(targetDomain);

    res.json({
      status: 'success',
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};
