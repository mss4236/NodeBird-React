module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
        "Post",
        {
            content: {
                type: DataTypes.TEXT, // 매우 긴글(글자수가 몇글자 될지 모를때 씀)
                allowNull: false,
            },
        },
        {
            charset: "utf8mb4", // 한글+이모티콘
            collate: "utf8mb4_general_ci",
        }
    );

    Post.associate = (db) => {
        db.Post.belongsTo(db.User); // Post는 User에 속해있다 ////////// belongsTo가 있는 테이블에 다른 테이블의 id를 저장함(Post 테이블에 UserId 저장)
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, { as: "Retweet" });
        db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
        db.Post.belongsToMany(db.User, { through: "Like", as: 'Likers' });
    };

    return Post;
};
