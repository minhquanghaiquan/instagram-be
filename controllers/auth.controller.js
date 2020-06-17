const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validations/user.validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.index = async (req, res)=> {
   const user = await User.findById(req.user);
   res.json({
       _id: user._id,
       email: user.email,
       name: user.name
   });
 }

module.exports.postRegister = async (req, res)=> {
    //Validation the data
    const {error} = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    // Check user in the database
    const emailExist = await User.findOne({email: req.body.email});
    if( emailExist) return res.status(400).send('Email alreasy exists');
    
    //Hash passwords
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err) {
        res.status(400).send(err)
    }
}

module.exports.postLogin = async (req, res)=> {
     //Validation the data
     const {error} = loginValidation(req.body)
     if (error) return res.status(400).send(error.details[0].message);

     // Check user in the database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password is wrong');
    
    //Check password 
    const vadidPass = bcrypt.compareSync(req.body.password, user.password);
    if(!vadidPass) return res.status(400).send('Email or password is wrong!');

    //Create and assign token
    const token = jwt.sign({_id: user._id}, 'thisistokensecret');
    res.json ({
        token,
        user : {
            id: user._id,
            email: user.email
        }
    });
}

module.exports.tokenIsValid = async (req, res)=> {
   try {
       const token = req.header('auth-token');
       if(!token) return res.json(false);

       const verified = jwt.verify(token, 'thisistokensecret' );
       if(!verified) return res.json(false);

       const user = await User.findById(verified._id);
       if(!user) return res.json(false);

       return res.json(true);
   }catch (err) {
       res.status(500).json({error: err.message});
   }
}
  