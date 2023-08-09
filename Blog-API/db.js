const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const authorSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { collection: "Authors" }
);

const postSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 50 },
    content: { type: String, required: true, minlength: 1, maxlength: 1000 },
    date: { type: Date, required: true },
    author: { type: Schema.ObjectId, required: true, ref: "Authors" },
  },
  { collection: "Posts" }
);

authorSchema.virtual("url").get(function () {
  return `/author/${this._id}`;
});

postSchema.virtual("formatDate").get(function () {
  if (this.date) {
    return DateTime.fromJSDate(this.date).toFormat("MM-dd-yy hh:mm a");
  }
  return null;
});

const Post = mongoose.model("Post", postSchema);
const Author = mongoose.model("Author", authorSchema);

module.exports = { Post, Author };
