const graphql = require('graphql')
const Movie = require('../models/Movie')
const Director = require('../models/director')


const {GraphQLObjectType} = graphql

const MovieType = new GraphQLObjectType({
    name : 'Movie',
    fields : () => ({
        id : {type:graphql.GraphQLID},
        name : {type:graphql.GraphQLString},
        genre : {type:graphql.GraphQLString},
        director : {
            type : DirectorType,
            resolve(parent,args){
                return Director.findById(parent.directorId)
            }
        }
    })
})

const DirectorType = new GraphQLObjectType({
    name : 'Director',
    fields : () => ({
        id : {type:graphql.GraphQLID},
        name : {type:graphql.GraphQLString},
        age : {type:graphql.GraphQLInt},
        movies:{
            type : new graphql.GraphQLList(MovieType),
            resolve(parent,args){
                return Movie.find({directorId:parent.id})
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        movie : {
            type : MovieType,
            args : {
                id: { type:graphql.GraphQLID }
            },
            resolve(parents,args){
                return Movie.findById(args.id)
            }
        },
        director : {
            type :DirectorType,
            args : {id: {type:graphql.GraphQLID}},
            resolve(parents,args){
                return Director.findById(args.id)
            }
        },
        movies : {
            type : new graphql.GraphQLList(MovieType),
            resolve(parent,args){
                return Movie.find({})
            }
        },
        directors :{
            type: new graphql.GraphQLList(DirectorType),
            resolve(parent,args){
                return Director.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields :{
        addMovie : {
            type : MovieType,
            args : {
                name : {type : graphql.GraphQLString},
                genre :{type : graphql.GraphQLString},
                directorId : {type : graphql.GraphQLID}
            },
            resolve (parent,args){
                let movie = new Movie({
                    name : args.name,
                    genre : args.genre,
                    directorId : args.directorId
                })

                return movie.save()
            }
        },
        addDirector : {
            type : DirectorType,
            args : {
                name : {type : graphql.GraphQLString},
                age : {type : graphql.GraphQLInt}
            },
            resolve(parent,args){
                let directoer = new Director({
                    name : args.name,
                    age : args.age
                })
                return directoer.save();
            }
        },
        updateMovie :{
            type : MovieType,
            args : {
                id : {type: graphql.GraphQLNonNull(graphql.GraphQLID)},
                name : {type : graphql.GraphQLString},
                genre : {type : graphql.GraphQLInt},
                directId : {type : graphql.GraphQLID}
            },
            resolve(parent,args){
                let updateMovie = {}
                args.name && (updateMovie.name = args.name)
                args.genre && (updateMovie.genre = args.genre)
                args.directId && (updateMovie.directId = args.directId)
                return Movie.findByIdAndUpdate(args.id, updateMovie, {new : true})  // 変更後の値を受け取る
            }
        },
        updateDirector :{
            type : DirectorType,
            args : {
                id : {type: graphql.GraphQLNonNull(graphql.GraphQLID)},
                name : {type : graphql.GraphQLString},
                age : {type : graphql.GraphQLInt}
            },
            resolve(parent,args){
                let updateDirector = {}
                args.name && (updateDirector.name = args.name)
                args.age && (updateDirector.age = args.age)
                return Director.findByIdAndUpdate(args.id, updatedirector, {new : true})  // 変更後の値を受け取る
            }
        },
        deleteMovie :{
            type : MovieType,
            args : {
                id : {type: graphql.GraphQLNonNull(graphql.GraphQLID)}
            },
            resolve(parent,args){
                return Movie.findByIdAndRemove(args.id)
            }
        },
        deleteDirector :{
            type : DirectorType,
            args : {
                id : {type: graphql.GraphQLNonNull(graphql.GraphQLID)}
            },
            resolve(parent,args){
                return Director.findByIdAndRemove(args.id)  // 変更後の値を受け取る
            }
        },
    }
})


module.exports = new graphql.GraphQLSchema({
    query : RootQuery,
    mutation : Mutation
})




