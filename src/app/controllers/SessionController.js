import * as Yup from 'yup'
import User from '../models/User'

class SessionController {
    async store(request, response) {
        const shema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        });

const isValid = await shema.isValid(request.body);
//verificar se os dados informados estão corretos//
if (!isValid) {
    return response
    .status(401)
    .json({error: 'Make sure that your email or password are correct'})
}

const { email, password } = request.body

const user = await User.findOne({
    where: {
        email,
    }
})
//verificar se o usuário existe//
if (!user) {
    return response
    .status(401)
    .json({error: 'Make sure that your email or password are correct'})
}

//verificar se a senha está certa//
const isSamePassword = await user.comparePassword(password);

console.log(isSamePassword)

        return response.json({ message: 'session' })
    }
}

export default new SessionController()