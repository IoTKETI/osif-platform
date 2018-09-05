var jwt   = require('jsonwebtoken');
var User  = require('../models/user.model.js');

/*
    POST /auth
    {
        userid,
        password
    }
*/

exports.register = (req, res) => {
  const { username, userid, password } = req.body
  let newUser = null;

  // create a new user if does not exist
  var create = (user) => {
    if(user) {
      throw new Error('userid exists')
    } else {
      return User.create(username, userid, password)
    }
  }

  // count the number of the user
  var count = (user) => {
    newUser = user
    return User.countDocuments({}).exec()
  }

  // assign admin if count is 1
  var assign = (count) => {
    if(count === 1) {
      return newUser.assignAdmin()
    } else {
      // if not, return a promise that returns false
      return Promise.resolve(false)
    }
  }

  // respond to the client
  var respond = (isAdmin) => {
    res.json({
      message: 'registered successfully',
      admin: isAdmin ? true : false
    })
  }

  // run when there is an error (userid exists)
  var onError = (error) => {
    res.status(409).json({
      message: error.message
    })
  }

  // check userid duplication
  User.findOneByUserId(userid)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError)
}


exports.login = (req, res) => {
  const {userid, password} = req.body
  const secret = req.app.get('jwt-secret')

  // check the user info & generate the jwt
  // check the user info & generate the jwt
  const check = (user) => {
    if(!user) {
      // user does not exist
      throw new Error('login failed')
    } else {
      // user exists, check the password
      if(user.verify(password)) {
        // create a promise that generates jwt asynchronously
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              username: user.username,
              userid: user.userid,
              admin: user.admin
            },
            secret,
            {
              expiresIn: '7d',
              issuer: 'CIoT Platform',
              subject: 'User login'
            }, (err, token) => {
              if (err) reject(err)
              resolve(token)
            })
        })
        return p
      } else {
        throw new Error('login failed')
      }
    }
  }

  // respond the token
  const respond = (token) => {
    res.json({
      message: 'logged in successfully',
      token
    })
  }

  // error occured
  const onError = (error) => {
    res.status(403).json({
      message: error.message
    })
  }

  // find the user
  User.findOneByUserId(userid)
    .then(check)
    .then(respond)
    .catch(onError)
};

exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.auth
  })
};


exports.tokenParser = (req, res, next) => {
  // read the token from header or url
  const token = req.headers['x-access-token'] || req.query.token

  // token does not exist
  if(!token) {
    req.auth = null;
    return next();
  }

  return new Promise((resolve, reject)=> {
    try {
      var auth  = {
        token: token
      };

      jwt.verify(token, req.app.get('jwt-secret'), (err, authToken) => {
        if(err) {
          auth.parsed = null;
          auth.error = err;

          req.auth = auth;
          next();
        }
        else {
          auth.parsed = authToken;
          auth.error = null;

          req.auth = auth;
          next();
        }
      });
    }
    catch(ex) {
      next();
    }
  });
};


exports.authCheck = (req, res, next) => {

  if(!req.auth) {
    return res.status(403).json({
      success: false,
      message: 'Login required'
    });
  }

  else if(req.auth.parsed) {
    return next();
  }

  else {
    return res.status(403).json({
      success: false,
      message: req.auth.error.name
    });
  }
};
