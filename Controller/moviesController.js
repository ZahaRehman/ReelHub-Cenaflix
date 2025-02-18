const {param}= require('../Routes/moviesRoutes');
const CustomError = require('../Utils/customError');
const Movie= require('./../Models/movieModal')
const ApiFeatures= require('./../Utils/apiFeatures')
const asyncErrorHandler = require('./../Utils/asyncErrorHandler')
const customError= require('./../Utils/customError')

exports.getHighestRated=(req,res,next)=>{
    req.query.limit='5';
    req.query.sort='-rating';
    next();
}



exports.createMovie= asyncErrorHandler(async (req,res, next)=>{

    const movie= await Movie.create(req.body);
    res.status(201).json({
        status: "success",
        data:{
            movie
        }
    })
      
});




exports.getAllMovies = asyncErrorHandler(async(req,res, next)=>{

    const  features= new ApiFeatures(Movie.find(), req.query).filter().sort().limitFields().pagination();
    let movies= await features.query;

    res.status(200).json({
        status: "success",
        lenght: movies.length,
        data:{
            movies
        }
    })

})


exports.getMovie = asyncErrorHandler(async(req, res, next)=>{

    // console.log(req.params.id);
    const movie= await Movie.findById(req.params.id);

    if(!movie){
        const error = new CustomError('Moive not found', 404);
        return next(error);
    }

    res.status(200).json({
        status: "success",
        data:{
            movie
        }
    })

})

exports.updateMovie= asyncErrorHandler(async(req, res, next)=>{
    
    const updatedMovie=  await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    
    if(!updatedMovie){
        const error = new CustomError('Moive not found', 404);
        return next(error);
    }

    res.status(201).json({
        status: "success",
        data:{
            updatedMovie
        }
    })

})

exports.deleteMovie = asyncErrorHandler(async(req,res, next)=>{
   
    const deletedMovie=  await Movie.findByIdAndDelete(req.params.id, req.body, {new: true, runValidators: true})
    
    if(!deletedMovie){
        const error = new CustomError('Moive not found', 404);
        return next(error);
    }
    
    res.status(201).json({
        status: "success",
        data:{
            deletedMovie
        }
    })

})


exports.getMoviesStats= asyncErrorHandler(async(req,res, next)=> {
    
    const stats= await Movie.aggregate([

        {$match:{  // to apply a matching condition 
            rating:{$gte:4.5}
        }},

        { $group: {
            _id: null,
            avgRating:{$avg: '$rating'},
            avgPrice: {$avg:'$price'},
            minPrice: {$min:'$price'},
            maxPrice: {$max:'$price'},
            priceTotal: {$sum: '$price'},
            movieCount: {$sum : 1}
        }},

        {$sort:{
            minPrice: 1
        }}
    
    ]);

    res.status(200).json({
        status: "success",
        data:{
            stats
        }
    })

})

exports.getAllMoviesByGener=asyncErrorHandler(async(req,res, next)=>{

    const genre=req.params.genre;
    const movies= await Movie.aggregate([
        {$unwind: '$genres'},   //create multiple document with a single document based on any array
        {$group:{
            
            _id: '$genres',
            movieCount: {$sum: 1},
            movies: {$push: '$name'},
            
        }},
        {$addFields: {genre: '$_id'}},  //to change the name of any fields
        {$project: {_id: 0}},  // to specify which fields to I want in response 
        {$sort: {movieCount: -1}},  //to sort based on a specfic variable/number or text
        //{$limit: 5}
        {$match: {genre: genre}}
    
    ]);
    res.status(200).json({
        status: "success",
        data:{
            movies
        }
    })

})











// 
                                                   // previous method 
                                                    
                                                    // exports.checkId= (req,res,next, value)=>{
                                                    //     const movie= movies.find(el=> el.id===+value)
                                                    
                                                    //     if(!movie){
                                                    
                                                    //         return res.status(404).json({
                                                    //         status: "fail",
                                                    //         message: "movie with ID " +value+ " is not found"
                                                    //         })
                                                    //     }
                                                    // }
                                                    
// exports.getAllMovies = (req,res)=>{
//     res.status(200).json({
//         status: "success",
//         count: movies.length,
//         requestedAt: req.requestedAt,
//         data:{
//             movies
//         }
//     })
// }


// exports.getMovie =(req, res)=>{
//     const id= +req.params.id    //to convert string to number using --> +
//     const movie= movies.find((item)=>{
//         return item.id===id
//     })

//     res.status(200).json(
//         {
//             status: "success",
//             data:{
//                 movie: movie
//             }
//         }
//     );
// }

// exports.createMovie= (req,res)=>{
//     // console.log(req.body);
//     const newId= movies[movies.length-1].id+1;
//     const newMovie= Object.assign({id: newId}, req.body)
//     movies.push(newMovie);
//     fs.writeFile('./Data/movies.json',JSON.stringify(movies),(err)=>{
//         res.status(201).json({
//             status:"success",
//             data:{
//                 movie: newMovie
//             }
//         })
//     })
    
// }

// exports.updateMovie= (req, res)=>{
//     let id=req.params.id*1;
//     let movieToUpdate=movies.find(el=> el.id===id)

//     const movieIndex= movies.indexOf(movieToUpdate);
//     let updated=Object.assign(movieToUpdate, req.body)
//     movies[movieIndex]= updated


//     fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
//         res.status(200).json({
//             status:"success",
//             data:{
//                 movie: updated
//             } 
//         })
//     })

// }

// exports.deleteMovie =(req,res)=>{
//     const id = +req.params.id;
//     const movietoDelete= movies.find(el=>el.id===id)
//     const index= movies.indexOf(movietoDelete);
//     movies.splice(index,1)

//     fs.writeFile('./data/movies.json', JSON.stringify(movies), (err)=>{
//         res.status(204).json({
//             status:"success",
//             data:{
//                 movie: null
//             } 
//         })
//     })
// }

