import userModel from "../models/Users.models.js"

export default class UserManager{
    async get() {
        const users = await userModel.find()
        return users
    }

    async add(newUser) {
        const result = await userModel.create(newUser)
        return result
    }

    async getById(id){
        const result = await userModel.findById(id)
        return result
     }

    
    // async delete(){

    // }
    // async update(){

    // }
}