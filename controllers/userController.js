const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Store,
          as: 'ownedStore',
          include: [
            {
              model: Rating,
              as: 'ratings'
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = user.toJSON();
    
    if (userData.role === 'store_owner' && userData.ownedStore) {
      const ratings = userData.ownedStore.ratings || [];
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;
      userData.store_rating = avgRating;
      userData.total_ratings = ratings.length;
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!['super_admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only administrators can create users' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const allowedRoles = ['admin', 'user', 'store_owner'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    const user = await User.create({
      name,
      email,
      password,
      address,
      role: userRole
    });

    const roleLabels = {
      admin: 'System Administrator',
      user: 'Normal User',
      store_owner: 'Store Owner'
    };

    res.status(201).json({
      message: `${roleLabels[userRole]} created successfully`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await user.validatePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ 
      message: 'Password updated successfully',
      success: true 
    });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      total_users: totalUsers,
      total_stores: totalStores,
      total_ratings: totalRatings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;

    if (!['super_admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only administrators can update users' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot update super admin' });
    }

    await user.update({ name, email, address, role });

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!['super_admin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only administrators can delete users' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot delete super admin' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};