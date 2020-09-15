const express = require("express");
const db = require("./models");
const port = 3065;

const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");

const app = express();
db.sequelize.sync();

// req.body.  을 사용하려면 이거 2줄 추가
app.use(express.json()); // json형식의 데이터를 처리할 수 있음
app.use(express.urlencoded({ extended: true })); // form으로 넘어온 데이터를 처리할 수 있음

app.use("/api/user", userAPIRouter);
app.use("/api/post", postAPIRouter);
app.use("/api/posts", postsAPIRouter);

app.listen(port, () => {
    console.log(`${port} connect`);
});
