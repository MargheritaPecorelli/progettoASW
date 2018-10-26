export class User {
    
    loggedUSer : boolean;

    constructor() { 
        this.loggedUSer = false;
    }

    isUserLogged() : boolean {
        return this.loggedUSer;
      }
    
      setUserLogged(logged: boolean) : void {
        this.loggedUSer = logged;
      }

}
    