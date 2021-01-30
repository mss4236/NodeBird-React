const express = require('express');
const db = require('../models');

const router = express.Router();

// GET api/hashtag/:tag
router.get("/:tag", async (req, res, next) => {
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
            limit: parseInt(req.query.limit, 10),
            include: [{
                model: db.Hashtag,
                where: { name: decodeURIComponent(req.params.tag) } // 한글이나 특수문자 같은거는 주소창을 통해 서버로 갈때 uriComponent로 바뀐다. 따라서 받을때는 decode해서 다시 바꿔줘야한다
            }, {
                model: db.User,
                attributes: ['id', 'nickname']
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

module.exports = router;