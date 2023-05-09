const moongose = require(moongose);
requrie("dotend").config();

exports.connect = () => {
  moongose
    .connect(process.env.MONGODB_URL, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Databse Connected Successfully!!");
    })
    .catch((err) => {
      console.log("Could not connect to the database", err);
      process.exit();
    });
};
