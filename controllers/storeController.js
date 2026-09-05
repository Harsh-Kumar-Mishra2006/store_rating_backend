const { Store, User, Rating } = require('../models');
const { Op } = require('sequelize');

exports.getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating', 'user_id']
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'address']
        }
      ],
      order: [['name', 'ASC']]
    });

    const storesWithRating = stores.map(store => {
      const storeData = store.toJSON();
      const ratings = storeData.ratings || [];
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;
      
      let userRating = null;
      if (req.user) {
        const userRatingData = ratings.find(r => r.user_id === req.user.id);
        if (userRatingData) {
          userRating = userRatingData.rating;
        }
      }

      return {
        id: storeData.id,
        name: storeData.name,
        email: storeData.email,
        address: storeData.address,
        owner: storeData.owner,
        overall_rating: avgRating,
        user_rating: userRating,
        total_ratings: ratings.length
      };
    });

    res.json(storesWithRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'address']
            }
          ]
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'address']
        }
      ]
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const storeData = store.toJSON();
    const ratings = storeData.ratings || [];
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;

    res.json({
      ...storeData,
      overall_rating: avgRating,
      total_ratings: ratings.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!['super_admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only administrators can create stores' });
    }

    const owner = await User.findOne({ 
      where: { 
        id: owner_id, 
        role: 'store_owner' 
      } 
    });

    if (!owner) {
      return res.status(400).json({ error: 'Invalid store owner. User must have store_owner role.' });
    }

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ error: 'Store with this email already exists' });
    }

    const existingOwnerStore = await Store.findOne({ where: { owner_id } });
    if (existingOwnerStore) {
      return res.status(400).json({ error: 'This store owner already has a store assigned' });
    }

    const store = await Store.create({
      name,
      email,
      address,
      owner_id
    });

    res.status(201).json({
      message: 'Store created successfully and assigned to owner',
      store: {
        ...store.toJSON(),
        owner: {
          id: owner.id,
          name: owner.name,
          email: owner.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, owner_id } = req.body;

    if (!['super_admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only administrators can update stores' });
    }

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (owner_id) {
      const owner = await User.findOne({ 
        where: { 
          id: owner_id, 
          role: 'store_owner' 
        } 
      });
      if (!owner) {
        return res.status(400).json({ error: 'Invalid store owner. User must have store_owner role.' });
      }
    }

    await store.update({ name, email, address, owner_id });

    res.json({
      message: 'Store updated successfully',
      store
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    if (!['super_admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only administrators can delete stores' });
    }

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    await store.destroy();

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStoreOwnerDashboard = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { owner_id: req.user.id },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'address']
            }
          ]
        }
      ]
    });

    if (!store) {
      return res.status(404).json({ error: 'No store found for this owner' });
    }

    const storeData = store.toJSON();
    const ratings = storeData.ratings || [];
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;

    res.json({
      store: {
        id: storeData.id,
        name: storeData.name,
        address: storeData.address,
        average_rating: avgRating,
        total_ratings: ratings.length
      },
      users_who_rated: ratings.map(r => ({
        user: r.user,
        rating: r.rating,
        submitted_at: r.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStoreOwners = async (req, res) => {
  try {
    const owners = await User.findAll({
      where: { role: 'store_owner' },
      attributes: ['id', 'name', 'email', 'address'],
      order: [['name', 'ASC']]
    });
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};