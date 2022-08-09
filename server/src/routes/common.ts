import axios from "axios";

var express = require("express");
var router = express.Router();

router.get("/wx-user-openId", async (req, res, next) => {
  const code = req.query.code;
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=wx3899bc7f66c891f0&secret=bd8e9cf8fd3e3c9e0082b430298cc7f1&js_code=${code}&grant_type=authorization_code`;

  const result = await axios.get(url);
  console.log(result.data);

  res.json(result.data);
});

module.exports = router;
