const express = require("express")

// or const expressGraphQL = require('express-graphql').graphqlHTTP
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose')
const app = express()

const schema = require('./schema/schema')


mongoose.connect('mongodb+srv://admin:passwd@cluster0.b38ft.mongodb.net/test?retryWrites=true&w=majority')
mongoose.connection.once('opne', ()=>{
    console.log('db connection')
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql : true
   }));

app.listen(4000, () => {
    console.log('listening port 4000')
})