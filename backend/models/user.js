const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            nickname: {
                type: DataTypes.STRING(20),
                allowNull: false, // false(Null을 허용하지않는다)이면 필수, true(Null을 허용한다)이면 선택
            },
            userId: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true, // true이면 고유한값(중복이면 안됨)
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        },
        {
            // 이거 2개 적어줘야 한글 적용됨
            charset: "utf8",
            collate: "utf8-_general_ci",
        }
    );

    User.associate = (db) => {
        db.User.hasMany(db.Post); // User(사용자)는 Post(게시글)를 여러개 가질 수 있다
        db.User.hasMany(db.Comment); // User(사용자)는 Comment(댓글)를 여러개 가질 수 있다
    };

    return User;
};
