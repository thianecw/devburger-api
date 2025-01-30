import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

class SessionController {
    async store(request, response) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        });

        const isValid = await schema.isValid(request.body);

        const emailOrPasswordIncorrect = () =>
            response
                .status(401)
                .json({ error: 'Make sure that your email or password are correct' })

        // verificar se os dados informados estão corretos
        if (!isValid) {
           return emailOrPasswordIncorrect()
        }

        const { email, password } = request.body

        const user = await User.findOne({
            where: {
                email,
            }
        })
        //verificar se o usuário existe
        if (!user) {
            return emailOrPasswordIncorrect()
        }

        //verificar se a senha está certa
        const isSamePassword = await user.checkPassword(password);

        if (!isSamePassword) {
            return emailOrPasswordIncorrect()
        }

        return response.status(201).json({
            id: user.id,
            name: user.name,
            email,
            admin: user.admin,
            token: jwt.sign({id: user.id}, authConfig.secret, {
                expiresIn: authConfig.expiresIn, 
            })
        })
    }
}

export default new SessionController()