const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next)=>{
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({ msg: "No authentication token, authorization denied." });

    try {
        const verified = jwt.verify(token, 'thisistokensecret' );
        //verified is your _id in the database
        req.user = verified._id;
        next();
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}