import User from "../modules/user.module.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {

    const { email, password } = req.body;

    const exists = await User.findOne({ email })
    if (exists) res.status(400).json({ msg: `${email} alwready exists please user different or login` })


    const hased = await bcrypt.hash(password, 10)

    const user = await User.create({
        email: email,
        password: hased,
    })

    res.status(200).json({ msg: "User created sucessfull , Please login " })
}


export const login = async (req, res) => {
    const { email, password } = req.body;  

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ msg: "User not found please signup" })
    
    const isMatchedPassword = await bcrypt.compare(password, user.password)
    if (!isMatchedPassword) return res.status(400).json({ msg: "Invalid email or password" })
    
    const token = await jwt.sign({id : user._id } , process.env.JWT_SECRATE)

    res.status(200).json({token : token})
}

