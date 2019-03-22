if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://lalanke:12345@cluster0-sgfqa.azure.mongodb.net:27017/vidjot-prod?retryWrites=true"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/vidjot-dev" };
}
