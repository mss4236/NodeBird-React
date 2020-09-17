const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");

const passportConfig = require("./passport");
const db = require("./models");
const port = 3065;

const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

// req.body.  을 사용하려면 이거 2줄 추가
app.use(express.json()); // json형식의 데이터를 처리할 수 있음
app.use(express.urlencoded({ extended: true })); // form으로 넘어온 데이터를 처리할 수 있음

// use는 부가적인 기능들(미들웨어(요청과 응답 사이에 존재))를 붙여줄 수 있음
app.use(morgan("dev")); // 요청 들어오는거에 대하여 로그가 남음
app.use(cors()); // 다른서버에서 요청이 와도 받을 수 있게
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키 알아서 분석
app.use(
    expressSession({
        // 무조건 넣어줘야하는 옵션
        reasve: false, // 매번 세션 강제 저장
        saveUninitialized: false, // 빈 값도 저장
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true, // true이면 자바스크립트로 쿠키에 접근을 못함
            secure: false, // https를 쓸 때 true
        },
    })
); // 세션 사용
app.use(passport.initialize());
app.use(passport.session()); // passport.session을 expressSession 밑에 적어줘야함, 미들웨어간에 서로 의존관계 때문, passport꺼가 expressSession 내부적꺼 사용해서 그럼

// 앞에 ""는 어떨때 뒤의 미들웨어를 실행할지 나타내는 것, 모든 때일때는 생략
app.use("/api/user", userAPIRouter);
app.use("/api/post", postAPIRouter);
app.use("/api/posts", postsAPIRouter);

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
