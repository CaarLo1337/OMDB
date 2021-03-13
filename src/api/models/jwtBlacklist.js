const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        expireAt: {
            type: Date,
            default: Date.now,
            expires: 180,
          }
    }
});

blacklistSchema.index({createdAt: 1},{expireAfterSeconds: 120});

const JwtBlacklist = mongoose.model('old jwt', blacklistSchema);

module.exports = JwtBlacklist;