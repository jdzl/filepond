const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(fileUpload())
app.use('/public', express.static(__dirname + '/public/'))
app.post('/upload', (req, res) => {

    let uploadFile = req.files.file
    const fileName = req.files.file.name
    uploadFile.mv(`${__dirname}/public/${fileName}`, (error) => {
        if (error)
            return res.status(500).send(error)

        return res.json({
            file: `public/${fileName}`,
        })
    }
    )
})
const server = app.listen(3000, () => console.log(`Running port ${server.address().port}`))