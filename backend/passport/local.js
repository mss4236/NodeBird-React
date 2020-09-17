const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const db = require("../models");

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "userId",
                passwordField: "password",
            },
            // req.body.userId, req.body.password를 userId, password로 삼겠다
            async (userId, password, done) => {
                // 로그인 전략(어떤사람을 로그인 시킬지)
                try {
                    const user = await db.User.findOne({ where: { userId } });
                    if (!user) {
                        return done(null, false, { reason: "존재하지 않는 사용자입니다!" });
                    }
                    const result = await bcrypt.compare(password, user.password);
                    if (result) {
                        return done(null, user);
                    }
                    return done(null, false, { reason: "비밀번호가 틀립니다." });
                } catch (e) {
                    // done(서버쪽에러, 성공했을때, 로직상에서 에러) // 서버쪽 에러나면 1
                    return done(e);
                }
            }
        )
    );
};
