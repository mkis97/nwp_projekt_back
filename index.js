require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')
const connection = require('./db')

app.use(cors())
//app.use(bodyParser.json())
app.use(express.json())

connection.connect()


app.post('/login', (req, res) => {
    const email = req.body.email
    const pass = req.body.password

    const user = {email: email}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query('SELECT * from users WHERE email = ? AND password = ?', [email, pass], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                res.json({accessToken: accessToken})
            } else {
                res.status(400).json({
                    message: 'Invalid email or password'
                })
            }
        });
    }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.get('/users', authenticateToken, (req, res) => {
    var page = parseInt(req.query.page)
    connection.query('SELECT * from users', function (error, results, fields) {
        if (error) throw error;
        const total = Math.ceil(results.length / 10)
        if (!page) {
            page = 1
        }
        if (page > total) {
            page = total
        }
        res.send({"page": page, "total": total, "data": results.slice(page * 10 - 10, page * 10)});
    });
})

app.post('/users', authenticateToken, function (req, res) {
    var firstname = req.body.firstname
    var lastname = req.body.lastname
    var email = req.body.email
    var password = req.body.password
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("INSERT INTO users (firstname, lastname, email, password) VALUES (?,?,?,?)", [firstname, lastname, email, password], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });
    }
})

app.delete('/users', authenticateToken, function (req, res) {
    var id = req.body.id
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("DELETE FROM users WHERE id = ?", [id], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });
    }
})

app.put('/users', authenticateToken, function (req, res) {
    var id = req.body.id
    var firstname = req.body.firstname
    var lastname = req.body.lastname
    var email = req.body.email
    var password = req.body.password
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ? WHERE id = ?", [firstname, lastname, email, password, id], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });

    }
})

app.get('/locations', authenticateToken, (req, res) => {
    var page = parseInt(req.query.page)
    connection.query('SELECT * from locations', function (error, results, fields) {
        if (error) throw error;
        const total = Math.ceil(results.length / 10)
        if (!page) {
            page = 1
        }
        if (page > total) {
            page = total
        }
        res.send({"page": page, "total": total, "data": results.slice(page * 10 - 10, page * 10)});
    });
})

app.post('/locations', authenticateToken, function (req, res) {
    var name = req.body.name
    var lat = parseFloat(req.body.lat)
    var lng = parseFloat(req.body.lng)
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("INSERT INTO locations (name, lat, lng) VALUES (?,?,?)", [name, lat, lng], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });
    }
})

app.delete('/locations', authenticateToken, function (req, res) {
    var id = req.body.id
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("DELETE FROM locations WHERE id = ?", [id], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });
    }
})

app.put('/locations', authenticateToken, function (req, res) {
    var id = req.body.id
    var name = req.body.name
    var lat = parseFloat(req.body.lat)
    var lng = parseFloat(req.body.lng)
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("UPDATE locations SET name = ?, lat = ?, lng = ? WHERE id = ?", [name, lat, lng, id], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });

    }
})


app.get('/events', authenticateToken, (req, res) => {
    var page = parseInt(req.query.page)
    connection.query('SELECT * from events', function (error, results, fields) {
        if (error) throw error;
        const total = Math.ceil(results.length / 10)
        if (!page) {
            page = 1
        }
        if (page > total) {
            page = total
        }
        res.send({"page": page, "total": total, "data": results.slice(page * 10 - 10, page * 10)});
    });
})

app.post('/events', authenticateToken, function (req, res) {
    var title = req.body.title
    var text = req.body.text
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("INSERT INTO events (title, text) VALUES (?,?)", [title, text], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });
    }
})

app.delete('/events', authenticateToken, function (req, res) {
    var id = req.body.id
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("DELETE FROM events WHERE id = ?", [id], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });
    }
})

app.put('/events', authenticateToken, function (req, res) {
    var id = req.body.id
    var title = req.body.title
    var text = req.body.text
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("UPDATE events SET title = ?, text = ? WHERE id = ?", [title, text, id], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });

    }
})

app.get('/offers', authenticateToken, (req, res) => {
    var page = parseInt(req.query.page)
    connection.query('SELECT * from offers', function (error, results, fields) {
        if (error) throw error;
        const total = Math.ceil(results.length / 10)
        if (!page) {
            page = 1
        }
        if (page > total) {
            page = total
        }
        res.send({"page": page, "total": total, "data": results.slice(page * 10 - 10, page * 10)});
    });
})

app.post('/offers', authenticateToken, function (req, res) {
    var title = req.body.title
    var text = req.body.text
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("INSERT INTO offers (title, text) VALUES (?,?)", [title, text], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });
    }
})

app.delete('/offers', authenticateToken, function (req, res) {
    var id = req.body.id
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("DELETE FROM offers WHERE id = ?", [id], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });
    }
})

app.put('/offers', authenticateToken, function (req, res) {
    var id = req.body.id
    var title = req.body.title
    var text = req.body.text
    if (!req.body) {
        return res.status(400).json({
            status: 'error',
            error: 'req body cannot be empty',
        });
    } else {
        connection.query("UPDATE offers SET title = ?, text = ? WHERE id = ?", [title, text, id], function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
                status: 'Success'
            })
        });

    }
})

app.get('/dashboard', authenticateToken, (req, res) => {
    connection.query('SELECT COUNT(id) AS Events,( SELECT COUNT(id) FROM locations ) AS Locations, ( SELECT COUNT(id) FROM users ) AS Moderators, ( SELECT COUNT(id) FROM offers ) AS Offers FROM Events', function (error, results, fields) {
        if (error) throw error;
        const total = results[0]
        let counts = []
        let labels = []
        for (const [key, value] of Object.entries(total)) {
            counts.push(value)
            labels.push(key)
        }
        res.send({"labels": labels, "counts": counts});
    });
})

app.listen(5000)
