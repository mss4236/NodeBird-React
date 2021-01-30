const db = require('../models');

// 로그인 되어 있는지 판별
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {    // req.isAuthenticated() 로그인 판별
        next();
    } else {
        res.status(401).send('로그인이 필요합니다.');
    }
};

// 로그아웃 되어 있는지 판별
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
    }
};

// 게시글이 존재하는지 판별
exports.isPost = async (req, res, next) => {
    try {
        const posts = await db.Post.findOne({ where: { id: req.params.postId } });
        if (posts) {
            req.posts = posts;
            next();
        } else {
            res.status(404).send('게시글이 존재하지 않습니다.');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};