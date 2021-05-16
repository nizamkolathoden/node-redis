const express = require('express');
const app = express();
const {promisify} = require('util')
app.use(express.json())
const port = process.env.PORT || 5000;
const redis = require('redis');
const client = redis.createClient({
    host: 'localhost',
    port:6379
});
//user DB
const DB = require('./help/DB')()
const User = require('./model/user')
client.on("error", function (error) {
    console.error(error);
});
const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);
app.post("/", async (req, res) => {
    try{
    const { name, age, height } = req.body;
    const createUser = await new User({
        name, age, height
    }).save()
    console.log(createUser)
}catch(e){
    console.log(e);
}
})

app.get("/user/:id",async(req,res)=>{
        try {
            const replay = await GET_ASYNC(req.params.id);
            if(replay) {
                res.send(replay);
                return;
            }
            const singleUser = await User.findById(req.params.id);
            const saveUserInCache = await SET_ASYNC(
                req.params.id,
                JSON.stringify(singleUser),
                'Ex',
                500
            )
            res.json(singleUser)
        } catch (error) {
            console.log(error);
        }
})


app.get('/', async (req, res) => {
    try {
        const replay = await GET_ASYNC('all');
        if(replay){
            res.send(JSON.parse(replay))
            return
        }
       const allUsers = await User.find()
       console.log(allUsers);
        const saveAll = await SET_ASYNC(
            'all',
            JSON.stringify(allUsers),
            'Ex',
            600
        )
       res.json(allUsers);

       
    } catch (error) {
        console.log(error);
    }

})

app.listen(port, () => console.log(`server running on port ${port}`))
