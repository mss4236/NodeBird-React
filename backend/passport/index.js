const passport = require("passport");
const db = require("../models");
const local = require("./local");

// serializeUser와 deserializeUser 나누는 이유는 서버쪽 메모리는 최소화 하기 위함
module.exports = () => {
    passport.serializeUser((user, done) => {
        // 서버쪽에 [{id: 3, cookie: 'asdfgn' }] // cookie는 프론트에 보내줌 // 프론트에서 asdfgn이라는 cookie를 서버로 보내면 asdfgn은 id: 3이랑 연결되 있구나 판단
        // 사용자 정보가 너무 많기 때문에
        return done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        // 실제로 사용자 정보를 써야 할때 프론트에서 asdfgn을 서버로 보내면 id: 3이라는 것밖에 모르므로 deserializeUser에서 id를 사용해서 유저정보를 찾는것임
        try {
            const user = await db.User.findOne({
                where: { id },
            });
            return done(null, user); // 불러온 정보는 req.user에 저장됨
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });

    local();
};

// 프론트에서 서버로는 cookie만 보냄(asdfgn)
// 서버가 쿠키파서, 익스프레스 세션이 쿠키 검사 후 id: 3 발견
// id: 3이 deserializeUser로 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱(한번 찾은 유저는 다시 안찾게 // db요청 비용이 제일 비쌈 서버비 아껴야함)
