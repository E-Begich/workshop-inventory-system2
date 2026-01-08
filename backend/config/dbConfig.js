module.exports = {
  HOST: "sql100.infinityfree.com",
  USER: "if0_40859394",
  PASSWORD: "21Prosinac1990",
  DB: "if0_40859394_ebegic1",
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

