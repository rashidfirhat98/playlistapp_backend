let mysql = require('mysql')
let express = require('express')
let cors = require('cors')

let connectionConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3307',
    database: 'youtube'
}

let app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res)=>{
    res.send("Welcome to Playlist API")    
})

app.get('/all/video', (req, res)=>{
    let connectionObject = mysql.createConnection(connectionConfig)
    connectionObject.connect(err=>{
        if (err) 
            throw err
        console.log("Connection to database is successful for " + JSON.stringify(req.method) + " " + JSON.stringify(req.route.path));
        
        let query = "select * from video"
        connectionObject.query(query, (err, data)=>{
            if (err)
                throw err
            console.log(data);
            res.send(data)
            connectionObject.end(err => {
            if (err) {
                throw err
            }
            console.log("Connection is ended");
            })
        })
    })
})

app.post("/add/video", (req, res) => {
    //console.log(request);
    console.log(req.body);
    let newvideo = req.body
    if (newvideo.videoid == "" ||
        newvideo.videoid == undefined ||
        newvideo.category == undefined ) {
        res.send([{
            "status": "Bad request body",
            "requestBodyReceived": req.body,
            "requestBodyExpected": "{'countryname':'abc', 'population':0, 'visited':0}"
        }])
        //process.exit()
        throw new Error("Bad request body")
    }
    
    //create connection
    console.log(req.params.myid);
    let connectionObject = mysql.createConnection(connectionConfig)
    //use connectionObject to connect to database
    connectionObject.connect(err => {
        if (err)
            throw err;
        console.log("Connection to database is successful for " + JSON.stringify(req.method) + " " + JSON.stringify(req.route.path));
        //execute the query
        let query = "insert into video (videoid, category) values (?, ?)"
        connectionObject.query(query, [newvideo.videoid, newvideo.category], (err, data) => {
            if (err)
                throw err
            console.log("Response for add new video")
            console.log(data);
            //response.send(data)
            if (data.affectedRows === 1) {
                res.send([{
                    "addStatus": "Success",
                    "id": data.insertId,
                    "addRowCount": data.affectedRows
                }])
            } else {
                res.send([{
                    "addStatus": "Fail",
                    "id": data.insertId,
                    "dataRowCount": data.affectedRows
                }])
            }
            connectionObject.end(err => {
                if (err)
                    throw err;
                console.log("Connection ended for " + req.route.path);
            })
        })
    })

})


app.get("/video/id/:myid", (req, res) => {
    //create connection
    console.log(req.params.myid);
    let id = req.params.myid
    let connectionObject = mysql.createConnection(connectionConfig)
    //use connectionObject to connect to database
    connectionObject.connect(err => {
        if (err)
            throw err;
        console.log("Connection to database is successful for " + JSON.stringify(req.method) + " " + JSON.stringify(req.route.path));
        //execute the query
        let query = "select * from video where id = " + id
        connectionObject.query(query, (err, data) => {
            if (err)
                throw err
            console.log("Response for video with id: " + id);
            console.log(data);
            res.send(data)
            connectionObject.end(err => {
                if (err)
                    throw err;
                console.log("Connection ended for " + req.route.path);
            })
        })
    })
})


app.delete("/video/id/:myid", (req, res) => {
    //create connection
    console.log(req.params.myid);
    let id = req.params.myid
    let connectionObject = mysql.createConnection(connectionConfig)
    //use connectionObject to connect to database
    connectionObject.connect(err => {
        if (err)
            throw err;
        console.log("Connection to database is successful for " + JSON.stringify(req.method) + " " + JSON.stringify(req.route.path));
        //execute the query
        let query = "delete from video where id = " + id
        connectionObject.query(query, (err, data) => {
            if (err)
                throw err
            console.log("Response for delete video with id: " + id);
            console.log(data);
            //response.send(data)
            if (data.affectedRows >= 1) {
                res.send([{
                    "deleteStatus": "Success",
                    "id": id,
                    "deleteRowCount": data.affectedRows
                }])
            } else {
                response.send([{
                    "deleteStatus": "Fail",
                    "id": id,
                    "deleteRowCount": data.affectedRows
                }])
            }
            connectionObject.end(err => {
                if (err)
                    throw err;
                console.log("Connection ended for " + req.route.path);
            })
        })
    })
})



app.listen(1234, ()=>{
    console.log("Listening to port 1234");
})