if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb://lalanke:12345@cluster0-shard-00-00-sgfqa.mongodb.net:27017,cluster0-shard-00-01-sgfqa.mongodb.net:27017,cluster0-shard-00-02-sgfqa.mongodb.net:27017/vidjot-prod?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/vidjot-dev" };
}
