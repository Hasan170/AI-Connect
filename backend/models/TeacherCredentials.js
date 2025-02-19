const mongoose = require("mongoose");

const teacherCredentialsSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("teachercredential", teacherCredentialsSchema);