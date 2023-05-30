const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const port = 3000;
const postRouter = require('./routes/postRoute');

const Comment = require('./models/comment');
const User = require('./models/user');
const Post = require('./models/post');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Comment.belongsTo(User);
Comment.belongsTo(Post);
Post.hasMany(Comment);
Post.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment);
User.hasMany(Comment);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/posts', postRouter);
app.use('/api/posts/:postId');

sequelize.sync({ alter: true })
  .then(result => {
    startServer();
  })
  .catch(err => {
    console.log(err);
});

const startServer = () => {
    app.listen(port, () => { 
        console.log(`Server is running at http://localhost:${port}`);
    });
}
