export class CreateUserDto{
    constructor(user) {
        this.fullName = `${user.first_name} ${user.last_name}`
        this.name = user.first_name
        this.lastName = user.last_name
        this.email = user.email
        this.password = user.password
        this.age = user.age
    }
}

export class GetUserDto {
    constructor(userDB){
        this.fullName = userDB.fullName
        this.email = userDB.email
    }
}