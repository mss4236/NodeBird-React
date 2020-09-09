const express = require("express");
const db = require("./models");

const app = express();
db.sequelize.sync();
