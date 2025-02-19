const express= require('express')
const moviesConroller = require('./../Controller/moviesController')
const authController= require('./../Controller/authController')

const router= express.Router();
//router.param('id',moviesConroller.checkId)

router.route("/highest-rated").get(moviesConroller.getHighestRated, moviesConroller.getAllMovies)
 
router.route('/movies-stats').get(moviesConroller.getMoviesStats)

router.route('/movies-by-gener/:genre').get(moviesConroller.getAllMoviesByGener)




router.route('/')
    .get(moviesConroller.getAllMovies)
    .post(moviesConroller.createMovie)

router.route('/:id')
    .get(authController.protected,moviesConroller.getMovie)
    .patch(moviesConroller.updateMovie)
    .delete(authController.protected,authController.restrict('admin'),moviesConroller.deleteMovie)

module.exports = router