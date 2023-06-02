const sequelize = require('../sequelize');
const User = require('../models/user');
const createDemoUser = async () => {
    try {
        const user = await User.create({
            firstName: 'Jon',
            lastName: 'Doe',
            email: 'JonDoe12@example.com'
        });
        console.log('User created successfully!');
        console.log(user.toJSON());
    } catch (error) {
        console.log('Failed to create user!');
        console.error(error);
    }
};

sequelize.sync()
.then(async (result) => {
    console.log('All models were synchronized successfully.');
    await createDemoUser();
  })
  .catch(err => {
    console.log(err);
  });




