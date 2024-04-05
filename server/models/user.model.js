import mongoose from 'mongoose'

var userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: 'This field is required'
    },
    lastName: {
        type: String
    },

    email: {
        type: String,
        required: 'This field is required'
    },

    password: {
        type: String,
        required: 'This field is required'
    },
    questions: {
        type: Array,
        required: 'This field is required'
    },
    role: {
        type: String,
        required: 'This field is required'
    }
});

mongoose.model("User", userSchema);

