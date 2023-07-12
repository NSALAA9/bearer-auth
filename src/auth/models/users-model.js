'ues strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET

// function users (sequelize, DataTypes){
//   const userModel =   sequelize.define('user', {
//         userName: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false
//         }   
// }

const users = (sequelize, DataTypes) =>  { const userModel = sequelize.define('user', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.VIRTUAL,
    }
})

userModel.basicAuthChecker = async function(userName,password ){
    const user = await userModel.findOne({ where: { userName } });
    const isValid = await bcrypt.compare(password, user.password)

    if(isValid) {
     const userToken = jwt.sign({userName: user.userName, password: user.password }, secretKey) 
       console.log(userToken)
       return {
        user,
        token: userToken}
    } else {
      throw new Error('Invalid User');
    }
}

userModel.bearerAuthChecker = async function(token){
    const parsedToken = jwt.verify(token, secretKey)   // parse the token into a data that we can read (paylode part, the user data)
    // console.log(parsedToken) 
    const user = await userModel.findOne({ where: {userName: parsedToken.userName } });
    if(user.userName){
      return user
    } else {
        throw new Error('Invalid Token');
    }

}


return userModel

}



module.exports = users