module.exports = {
  HOST: "student.veleri.hr",
  USER: "ebegic1",
  PASSWORD: "11",
  DB: "ebegic1",
  dialect: "mysql",
  dialectModule: require("mysql2"),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: false,
  },
};

