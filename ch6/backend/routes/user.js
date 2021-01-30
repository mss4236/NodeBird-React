const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../models");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require('./middleware');

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구(프론트 엔드 서버와 백엔드 서버가 따로 있는데 프론트 엔드 서버가 백엔드 서버를 사용할 수 있게?)
// /api/user/
router.get("/", isLoggedIn, (req, res) => {
   return res.json(req.user);
});

// POST /api/user/ 회원가입
router.post("/", isNotLoggedIn, async (req, res) => {
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
      return res.status(200).json(newUser); // newUser를 프론트에 보냄, json은 json데이터를 보내는거임
   } catch (e) {
      console.error(e);
   }
});

// GET /api/user/:id ===> 해당 사용자의 정보를 가져옴
router.get("/:id/", async (req, res, next) => {
   try {
      const user = await db.User.findOne({
         where: {
            id: parseInt(req.params.id, 10),
         },
         include: [{
            model: db.Post,
            as: 'Posts',
            attributes: ['id']
         }, {
            model: db.User,
            as: 'Followings',
            attributes: ['id']
         }, {
            model: db.User,
            as: 'Followers',
            attributes: ['id']
         }],
         attributes: ['id', 'nickname', 'userId'],
      });
      const jsonUser = user.toJSON();
      jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
      jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
      jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
      res.json(jsonUser);
   } catch (error) {
      console.error(error);
      next(error);
   }
}); // 남의 정보 가져오는 것, :id는 req.params.id로 가져올 수 있다 // ex) /3 이면 id가 3인 유저정보를 가져오겠다는 의미

// Post /api/user/logout ===> 로그아웃 요청
router.post("/logout/", (req, res) => {
   req.logOut();
   req.session.destroy();
   res.send("logOut 성공");
});

// POST /api/user/login ===> 로그인 요청
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
         //  const filteredUser = Object.assign({}, user.toJSON()); // user 얕은 복사
         //  delete filteredUser.password; // password는 지움
         return res.redirect('/api/user'); // password 지운 사용자 정보를 json형태로 프론트에 보내줌 ===> deSirealizeUser에 적어놔서 그것을 실행하게하기 위함
      });
   })(req, res, next); // (err, user, info)는 done에서 (서버쪽에러, 성공했을때, 로직상에러) 와 같음
});

//GET /api/user/:userId/followings :: 팔로잉한 유저들 정보 요청
router.get("/:userId/followings/", isLoggedIn, async (req, res, next) => {
   try {
      const user = await db.User.findOne({
         where: { id: parseInt(req.params.userId, 10) || (req.user && req.user.id) || 0 },
      });
      const followings = await user.getFollowings({
         limit: parseInt(req.query.limit, 10),
         offset: parseInt(req.query.offset, 10),
         attributes: ['id', 'nickname']
      });
      return res.json(followings);
   } catch (error) {
      console.error(error);
      next(error);
   }
});

//GET /api/user/:userId/followers :: 팔로워한 유저들 정보 요청
router.get("/:userId/followers/", isLoggedIn, async (req, res, next) => {
   try {
      const user = await db.User.findOne({
         where: { id: parseInt(req.params.userId, 10) || (req.user && req.user.id) || 0 },
      });
      const followers = await user.getFollowers({
         limit: parseInt(req.query.limit, 10),
         offset: parseInt(req.query.offset, 10),
         attributes: ['id', 'nickname']
      });
      return res.json(followers);
   } catch (error) {
      console.error(error);
      next(error);
   }
});

// POST api/user/:userId/follow/ :: 유저 팔로우
router.post("/:userId/follow/", isLoggedIn, async (req, res, next) => {
   try {
      const me = await db.User.findOne({
         where: { id: req.user.id }
      });
      await me.addFollowings(req.params.userId);
      return res.send(req.params.userId);
   } catch (error) {
      console.error(error);
      next(error);
   }
});

// DELETE api/user/:userId/follow/ :: 유저 언팔로우
router.delete("/:userId/follow/", isLoggedIn, async (req, res, next) => {
   try {
      const me = await db.User.findOne({
         where: { id: req.user.id }
      });
      await me.removeFollowings(req.params.userId);
      return res.send(req.params.userId);
   } catch (error) {
      console.error(error);
      next(error);
   }
});

// DELETE api/user/:userId/follower/ :: 팔로워 유저 제거
router.delete("/:userId/followers/", isLoggedIn, async (req, res, next) => {
   try {
      const me = await db.User.findOne({
         where: {
            id: req.user.id,
         }
      });
      await me.removeFollowers(req.params.userId);
      return res.send(req.params.userId);
   } catch (error) {
      console.error(error);
      next(error);
   }
});

// GET /api/user/:id/posts/ :: 해당 사용자의 게시글들 가져옴
router.get("/:id/posts/", async (req, res, next) => {
   try {
      let where = {};
      if (parseInt(req.query.lastId, 10)) {
         where = {
            id: {
               [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10)    // less than // req.query.lastId보다 작은 id인 애들을 가져온다
            },
            UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
            RetweetId: null,
         }
      } else {
         where = {
            UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
            RetweetId: null,
         }
      }
      const posts = await db.Post.findAll({
         where,
         limit: parseInt(req.query.limit, 10),
         include: [{
            model: db.User,
            attributes: ['id', 'nickname'],
         }, {
            model: db.Image
         }, {
            // 좋아요 누른 사람들
            model: db.User,
            through: 'Like',
            as: 'Likers',
            attributes: ["id"]
         }],
         order: [['createdAt', 'DESC']]
      });
      res.json(posts);
   } catch (error) {
      console.error(error);
      next(error);
   }
});

// PATCH /api/nickname/ :: 닉네임 변경
router.patch("/nickname/", isLoggedIn, async (req, res, next) => {
   try {
      await db.User.update({
         nickname: req.body.nickname
      }, {
         where: { id: req.user.id }
      });
      return res.send(req.body.nickname);
   } catch (error) {
      console.error(error);
      next(error);
   }
});

module.exports = router;
