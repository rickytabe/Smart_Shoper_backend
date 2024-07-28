const User = require('../models/User');


exports.getUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
      });
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
  
  
    exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll(); // Fetch all users from the database
      res.json(users); // Send the users as a JSON response
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  };
  
  exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Update user data (handle password hashing if necessary)
      await user.update({ username, email, password });
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  };
  
  exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.destroy();
      res.status(204).end(); // 204 No Content - successful deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  };
  