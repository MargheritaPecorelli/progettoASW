export class User {
    
    email: string;
    password: string;
    name: string;
    surname: string;
    admin: boolean;
    hash: string;
    salt: string;

    constructor( name: string, surname: string, email: string, admin: boolean, hash: string = "0", salt: string = "0") { 
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.admin = admin;
        this.hash = hash;
        this.salt = salt;

    }

}