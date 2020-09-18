const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../models");
const passport = require("passport");

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구(프론트 엔드 서버와 백엔드 서버가 따로 있는데 프론트 엔드 서버가 백엔드 서버를 사용할 수 있게?)
router.get("/", (req, res) => {}); // /api/user/

// POST /api/user/ 회원가입
router.post("/", async (req, res) => {
   try {
      const exUser = await db.User.findOne({
         where: {
            userId: req.body.userId,
         }, // 찾고 싶은 조건
      }); // 해당 유저가 있는지 확인, findOne는 하나만 찾는거임, 비동기 promise이기 때문에 await 붙여줘야함
      if (exUser) {
         return res.status(403).send("이미 사용중인 아이디입니다."); // status(400~599)를 써야 에러를 의미함(서버와 프론트 간에 약속) // 200-성공, 300-리다이렉션, 400-요청오류, 500-서버오류
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 12); // bcrypt를 이용해서 비밀번호를 암호화해줌 // 12가 salt인데 커질수록 해킹하기가 힘들어지는데 그만큼 비밀번호 만드는 시간도 오래걸림 보통 10~13으로 많이함
      const newUser = await db.User.create({
         nickname: req.body.nickname,
         userId: req.body.userId,
         password: hashedPassword,
      }); // 생성된 유저의 정보가 newUser에 저장됨
      console.log(newUser);
      return res.status(200).json(newUser); // newUser를 프론트에 보냄, json은 json데이터를 보내는거임
   } catch (e) {
      console.error(e);
   }
});
router.get("/:id/", (req, res) => {}); // 남의 정보 가져오는 것, :id는 req.params.id로 가져올 수 있다 // ex) /3 이면 id가 3인 유저정보를 가져오겠다는 의미
router.post("/logout/", (req, res) => {
   req.logOut();
   req.session.destroy();
   res.send("logOut 성공");
});
router.post("/login/", (req, res, next) => {
   passport.authenticate("local", (err, user, info) => {
      if (err) {
         console.error(err);
         return next(err); // express가 에러 처리함
      }
      if (info) {
         return res.status(401).send(info.reason);
      }
      // 사용자정보(user)로 로그인 시킴, 로그인하면 서버쪽에 세션이랑 쿠키 저장됨
      return req.logIn(user, async (loginErr) => {
         // req.logIn 실행하면 serializeUser가 실행됨
         if (loginErr) {
            return next(loginErr);
         }
         const fullUser = await db.User.findOne({
            where: { id: user.id },
            include: [
               {
                  model: db.Post,
                  as: "Posts",
                  attributes: ["id"], // attributes로 필터링함
               },
               {
                  model: db.User,
                  as: "Followers",
                  attributes: ["id"],
               },
               {
                  model: db.User,
                  as: "Followings",
                  attributes: ["id"],
               },
            ],
            attributes: ["id", "nickname", "userId"], // id, nickname, userId만 프론트로 보냄
         });

         //  const filteredUser = Object.assign({}, user.toJSON()); // user 얕은 복사
         //  delete filteredUser.password; // password는 지움
         return res.json(fullUser); // password 지운 사용자 정보를 json형태로 프론트에 보내줌
      });
   })(req, res, next); // (err, user, info)는 done에서 (서버쪽에러, 성공했을때, 로직상에러) 와 같음
}); //POST /api/user/login
router.get("/:id/follow/", (req, res) => {});
router.post("/:id/follow/", (req, res) => {});
router.delete("/:id/follow/", (req, res) => {});
router.delete("/:id/follower/", (req, res) => {});
router.get("/:id/posts/", (req, res) => {});

module.exports = router;
