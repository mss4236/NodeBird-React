module.exports = (sequelize, DataTypes) => {
   const User = sequelize.define(
      "User", // 앞에를 대문자로 쓰면 테이블이 생성될때 users(앞부분은 소문자가되고 s가 붙음)가 된다
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
         collate: "utf8_general_ci",
      }
   );

   User.associate = (db) => {
      db.User.hasMany(db.Post, { as: "Posts" }); // User(사용자)는 Post(게시글)를 여러개 가질 수 있다
      db.User.hasMany(db.Comment); // User(사용자)는 Comment(댓글)를 여러개 가질 수 있다
      db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });

      // 같은거에 다대다 관계일 경우 2개 적어주고 as로 구분해줌
      db.User.belongsToMany(db.User, { through: "Follow", as: "Followers", foreignKey: "followingsId" }); // foreignKey가 남의 테이블 id를 가리키기 때문에 이름을 반대로 써줘야함
      db.User.belongsToMany(db.User, { through: "Follow", as: "Followings", foreignKey: "followersId" }); // as는 자바스크립트 객체에서 사용할 이름이고 foreignKey는 db테이블에서 사용할 컬럼이름(as로 이름 바꾼거는 사용자 입장에서 생각하면 좋음)
   };

   return User;
};
