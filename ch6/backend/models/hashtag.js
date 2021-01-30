module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define(
        "Hashtag",
        {
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
        },
        {
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
        }
    );

    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" }); // 다대다 관계(n:m)에서 속해 있을 경우(다대다 관계에서는 두 테이블 사이에 관계를 설명하는 테이블이 하나 생김)
    };

    return Hashtag;
};
