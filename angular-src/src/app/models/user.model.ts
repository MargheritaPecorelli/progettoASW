export class User {
    
    email: string;
    password: string;
    name: string;
    surname: string;
    admin: boolean;

    constructor( name: string, surname: string, email: string, admin: boolean) { 
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.admin = admin
    }

}
    