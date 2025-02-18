const mongoose = require('mongoose');
const fs= require('fs')
const validator= require('validator');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required field"],
        unique: true,
        maxlength:[100,"movie namke can not be more then 100 characters"],
        trim: true,
        // validate: [validator.isAlpha, "Name should only contain Alphabets"]
    },
    description: {
        type: String,
        required: [true, "Description is required field"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "Duration is required field"]
    },
    rating: { 
        type: Number,
        validate: {
            validator: function(value) {
                return value >= 1 && value <= 10;
            },
            message: "Rating should be between 1 and 10"
        }
       
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, "Release year is required field"]
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    genres: {
        type: [String],
        required: [true, "Genres are required"],
        // enum:{
        //     values: ["Action","Thriller","Sci-Fi"],
        //     message: "this genre does not exist"
        // }
    },
    directors: {
        type: [String],
        required: [true, "Directors are required"]
    },
    coverImage: {
        type: String,
        required: [true, "Cover image is required"]
    },
    actors: { 
        type: [String],
        required: [true, "Actors are required"]
    },
    price: {
        type: Number
    },
    createdBy: String
},
{                        // options can be added here
    toJSON: {virtuals: true},
    toObject:{virtuals: true}
});

movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60;
})

movieSchema.pre('save',function(next){
    this.createdBy= 'Zaha';
    next();
})
movieSchema.post('save', function(doc,next){
    const content= `A new movie document was created with anme ${doc.name}`
    fs.writeFileSync('./Log/log.txt', content, {flag: 'a'},(err)=>{
        console.log(err.message);
    });
    next();

})


movieSchema.pre(/^find/, function(next){   //query middleware
    this.find({releaseDate:{$lte: Date.now()}});
    next();
})
// movieSchema.post(/^find/, function(docs,next){   //query middleware
//     this.find({releaseDate:{$lte: Date.now()}});
//     next();
// })


// aggregation middleware

movieSchema.pre('aggregate', function(next){
    console.log(this.pipeline().unshift({$match: {releaseDate:{$lte: new Date()}}}));
    next();
})


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
