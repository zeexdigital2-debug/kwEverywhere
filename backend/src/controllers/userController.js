async function getUserCredits(req, res) {
  try {
    const credits = req.credits;
    return res.json({
      success: true,
      credits,
      user: {
        id: req.user.id,
        email: req.user.email,
        isGuest: req.user.isGuest
      }
    });
  } catch (err) {
    console.error('[userController] Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { getUserCredits };
