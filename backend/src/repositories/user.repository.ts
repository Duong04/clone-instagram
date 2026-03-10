import UserModel from '~/models/user.model'

class UserRepository {
  async findByEmail(email: string) {
    return UserModel.findOne({ email })
  }

  async create(data: object) {
    return UserModel.create(data)
  }

  async findById(id: string) {
    return UserModel.findById(id)
  }
}

export default new UserRepository()
