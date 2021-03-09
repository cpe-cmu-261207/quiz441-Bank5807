import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, query, validationResult } from 'express-validator'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000
const SECRET = "SIMPLE_SECRET"

interface JWTPayload {
  username: string;
  password: string;
}

app.post('/login', (req, res) => {

    const { username, password } = req.body
    // Use username and password to create token.
    if(!validationResult(req)){
      return res.status(400).json({
        message: 'Invalid username or password'
      })
    }
    const token = jwt.sign(username, SECRET);
    return res.status(200).json({
      message: 'Login succesfully',
      token: token
    })
  })

app.post('/register',
  (req, res) => {

    const { username, password, firstname, lastname, balance } = req.body
  
    for(var i = 0;i < body.length;i++) {
      if(validationResult(req)){
        return res.status(401).json({
          message: 'Username is already in used'
        })
      }  
    }
    return res.status(200).json({
      message:'Register successfully'
    })
  })

app.get('/balance',
  (req, res) => {
    const firstname = req.query.firstname as string
    const lastname = req.query.lastname as string
    const balance = req.query.balance
    const token = req.query.token as string
    try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
    }
    catch (e) {
      return res.status(401).json({
        message: 'Invaild token.'
      })
    }
    return res.status(200).json({
      name: `${firstname} ${lastname}`,
      balance: balance
    })
  })

app.post('/deposit',
  body('amount').isInt({ min: 1 }),
  (req, res) => {
    var amount = req.body.balance
    const token = req.body.token as string
    try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
    }
    catch (e) {
      return res.status(401).json({
        message: 'Invaild token.'
      })
    }

    if (!validationResult(req).isEmpty())
    return res.status(400).json({ 
      message: 'Invalid data' 
    })
    
    if (validationResult(req))
    amount =+ req;
    return res.status(200).json({
      message : 'Deposit successfully',
      balance : amount
    })    
  })

app.post('/withdraw',
  (req, res) => {
    var balance = req.body.balance
    const token = req.query.token as string
    try {
      const { username } = jwt.verify(token, SECRET) as JWTPayload
    }
    catch (e) {
      return res.status(401).json({
        message: 'Invaild token.'
      })
    }

    if (!validationResult(req).isEmpty())
    return res.status(400).json({ 
      message: 'Invalid data'
    })

    if (validationResult(req))
    balance =- req;
    return res.status(200).json({
      message : 'Deposit successfully',
      balance : balance
    })    
  })

app.delete('/reset', (req, res) => {
  var username = req.body.username as string
  var password = req.body.password as string
  var firstname = req.body.firstname as string
  var lastname = req.body.lastname as string
  var balance = req.body.balance
  
  req.body = [
    username = '',
    password = '',
    firstname = '',
    lastname = '',
    balance = 0
  ]
  
  return res.status(200).json({
    message: 'Reset database successfully'
  })
})

app.get('/me', (req, res) => {
  return res.status(200).json({
    firstname: 'Tanat',
    lastname: 'Wipasakunden',
    code: '620610787',
    gpa: '2.00'
  })
})

app.get('/demo', (req, res) => {
  return res.status(200).json({
    message: 'This message is returned from demo route.'
  })
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))