const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
      text: {
        type: String,
        required: true,
      },
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
