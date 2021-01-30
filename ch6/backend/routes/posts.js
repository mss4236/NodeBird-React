const express = require("express");
const db = require('../models');

const router = express.Router();

// GET /api/posts
router.get("/", async (req, res, next) => {
    try {
        let where = {};
        if (parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10)    // less than // req.query.lastId보다 작은 id인 애들을 가져온다
                }
            }
        }
        const posts = await db.Post.findAll({
            where,
            include: [{
                // 게시글 작성한 사람
                model: db.User,
                attributes: ["id", "nickname"]
            }, {
                model: db.Image,
            }, {
                // 좋아요 누른 사람들
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ["id"]
            }, {
                model: db.Post,
                as: 'Retweet',
                include: [{
                    model: db.User,
                    attributes: ["id", "nickname"]
                }, {
                    model: db.Image
                }]
            }],
            limit: parseInt(req.query.limit, 10),
            order: [['createdAt', 'DESC']], // 내림차순으로해서 최신글을 제일 위에
        });
        return res.json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
