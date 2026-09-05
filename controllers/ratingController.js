const { Rating, Store } = require('../models');

exports.submitRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const existingRating = await Rating.findOne({
      where: { user_id: userId, store_id: storeId }
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({
        message: 'Rating updated successfully',
        rating: existingRating
      });
    }

    const newRating = await Rating.create({
      rating,
      user_id: userId,
      store_id: storeId
    });

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: newRating
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findOne({
      where: { user_id: userId, store_id: storeId }
    });

    res.json({
      has_rated: !!rating,
      rating: rating ? rating.rating : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};