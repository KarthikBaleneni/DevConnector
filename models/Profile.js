const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',

        },
        company: {
            type: String,
        },
        website: {
            type: String,
        },
        location: {
            type: String,
        },
        status: {
            type: String,
            required: true
        },
        bio: {
            type: String
        },
        skills: {
            type: [String],
        },
        githubusername: {
            type: [String],
        },
        experience: [
            {
                title: {
                    type: String,
                    required: trues
                },
                company: {
                    type: String,
                    required: true
                },
                location: {
                    type: String,
                },
                from: {
                    type: Date,
                    required: true
                },
                to: {
                    type: Date,
                },
                current: {
                    type: Boolean,
                    required: true
                },
                description: {
                    type: String,
                },
            }
        ],
        education: [
            {
                school: {
                    type: String,
                },
                degree: {
                    type: String,
                },
                fieldofstudy: {
                    type: String,
                },
                from: {
                    type: Date,
                    required: true
                },
                to: {
                    type: Date,
                },
                current: {
                    type: String,
                },
                description: {
                    type: String,
                },
            }
        ],
        scoial: {
            linkedin: {
                type: String
            },
            youtube: {
                type: String
            },
            facebook: {
                type: String
            },
            twitter: {
                type: String
            },
            instagram: {
                type: String
            }
        },
        data: {
            type: Date,
            default: Date.now
        }
    }
);


module.exports = profile = mongoose.model('profile', ProfileSchema);