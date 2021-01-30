const express = require("express");
const multer = require('multer');   // formdata로 받은거는 bodyParser로 처리 못해서 multer를 사용함
const path = require('path');
const { isLoggedIn, isPost } = require('./middleware');
const db = require("../models");

const router = express.Router();

// multer 설정
const upload = multer({
    // 서버쪽 저장장치에 저장하겠다는 속성
    storage: multer.diskStorage({   // diskStorage에 저장하겠다
        destination(req, file, done) {    // 어떤 경로에 저장할지
            done(null, 'uploads');    // uploads라는 폴더에 저장
        },
        filename(req, file, done) { // 파일명 처리
            const ext = path.extname(file.originalname);    // 파일의 확장자 추출
            const basename = path.basename(file.originalname, ext)  // 확장자 ext를 제외한 파일의 이름 추출
            done(null, basename + new Date().valueOf() + ext);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 } // 파일 용량제한 설정, 한번에 파일개수 설정    // 사이즈가 너무 크거나 제한이 없으면 해커들이 이걸로 공격할 수도 있음
});

// POST api/post    // 게시글 작성
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s]+/g);
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtags) {  // 해시태그가 존재하면
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
                where: {
                    name: tag.slice(1).toLowerCase()
                }
            })));   // 해시태그가 db에 존재하지 않으면 #빼고 저장;
            await newPost.addHashtags(result.map(r => r[0]));
        }
        // 이미지 정보 추가
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {    // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]
                // 동시에 여러개 쿼리 실행
                const images = await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image });
                }));
                await newPost.addImages(images);
            } else {    // 이미지 주소를 하나만 올리면 image: 주소1
                const image = await db.Image.create({ src: req.body.image });
                await newPost.addImage(image);
            }
        }
        // user정보 추가로 가져오기 방법1
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [{
                model: db.User,
                attributes: ["nickname"],
            }, {
                model: db.Image,
            }]
        });
        return res.json(fullPost);
        // 방법2
        /* const User = await newPost.getUser();
        newPost.User = User;
        res.json(newPost); */
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST api/post/images
router.post("/images", upload.array('image'), (req, res) => { // 한장만 올리면 single, 여러장 올리면 array 'image'는 formdata.append 할때 첫번째 인자인 name과 일치, 사진마다 name이 다르면 fields, 폼데이터를 보냈는데 이미지를 하나도 안올린경우 none
    // 올린 파일들은 req.files에 저장, single이면 req.file에, 폼데이터 일반값(upload.none())은 req.body로 감
    res.json(req.files.map(v => {
        return v.filename
    }));
});

// GET api/post/:id/comments  :: 게시글 댓글들 가져오는 라우터
router.get("/:postId/comments", isPost, async (req, res, next) => {
    try {
        const comments = await db.Comment.findAll({
            where: {
                PostId: req.posts.id
            },
            order: [['createdAt', 'ASC']],
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }]
        });
        return res.json(comments);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST api/post/:id/comment    :: 댓글작성 라우터
router.post("/:postId/comment", isLoggedIn, isPost, async (req, res, next) => { // id는 해당 게시물의 id
    try {
        const newComment = await db.Comment.create({
            UserId: req.user.id,
            PostId: req.posts.id,
            content: req.body.content,
        });
        await req.posts.addComment(newComment.id);
        const comment = await db.Comment.findOne({
            where: {
                id: newComment.id
            },
            include: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }],
        });
        return res.json(comment);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST api/post/:postId/like :: 좋아요
router.post("/:postId/like", isLoggedIn, isPost, async (req, res, next) => {
    try {
        await req.posts.addLiker(req.user.id);
        res.json({ userId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// DELETE api/post/:postId/like :: 좋아요 취소
router.delete("/:postId/like", isLoggedIn, isPost, async (req, res, next) => {
    try {
        await req.posts.removeLiker(req.user.id);
        res.json({ userId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//  POST api/post/:postId/retweet :: 리트윗
router.post("/:postId/retweet", isLoggedIn, isPost, async (req, res, next) => {
    try {
        if (req.user.id === req.posts.UserId) {
            return res.status(403).send('자신의 글을 리트윗할 수 없습니다.');
        };

        const retweetTargetId = req.posts.RetweetId || req.posts.id;  // 리트윗한 게시글이 리트윗된 게시글이면 원본 id 가져오고 아니면 해당게시물 id 가져옴;
        const exPost = await db.Post.findOne({
            where: {
                UserId: req.user.id,
                id: retweetTargetId,
            },
        });
        const exPostAlready = await db.Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });
        if (exPost) {
            return res.status(403).send('자신의 글을 리트윗할 수 없습니다.');
        }
        if (exPostAlready) {
            return res.status(403).send('이미 리트윗 했습니다.');
        }
        const retweet = await db.Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet'
        });
        const retweetWithPrevPost = await db.Post.findOne({ // 리트윗한 게시글 불러오기
            where: { id: retweet.id },  // 리트윗한 내 게시글
            include: [{
                model: db.User, // 리트윗한 내 게시글에 작성자정보 추가
                attributes: ["id", "nickname"],
            }, {
                model: db.Post, // 리트윗한 게시글 불러옴
                as: 'Retweet',
                include: [{
                    model: db.User, // 리트윗한 게시글의 작성자정보
                    attributes: ["id", "nickname"],
                }, {
                    model: db.Image // 리트윗한 게시글의 이미지
                }]
            }, {
                model: db.Image,
            }]
        });
        return res.json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// DELETE api/post/:postId/ :: 게시물 삭제
router.delete("/:postId/", isLoggedIn, isPost, async (req, res, next) => {
    try {
        await db.Post.destroy({ where: { id: req.params.postId } });
        return res.send(req.params.postId);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// GET api/post/:postId/ :: 게시글 하나 가져옴
router.get("/:postId/", isPost, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.postId },
            include: [{
                model: db.User,
                attributes: ["id", "nickname"]
            }, {
                model: db.Image,
            }]
        });
        return res.json(post);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// PATCH api/post/:postId/patch/ :: 게시글 수정
router.patch("/:postId/patch", isLoggedIn, isPost, async (req, res, next) => {
    try {
        if (req.user.id === req.body.postUserId) {
            await db.Post.update({ content: req.body.postContent }, { where: { id: req.params.postId } });
        }
        const post = await db.Post.findOne({
            where: { id: req.params.postId },
            include: [{
                model: db.User,
                attributes: ["id", "nickname"]
            }, {
                model: db.Image,
            }]
        });
        return res.json(post);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
