import { Component } from '@angular/core';
import { AuthenticationService, UserDetails, TokenPayload } from '../services/authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  details: UserDetails;
  private mail: string;

  constructor(private auth: AuthenticationService, private route: ActivatedRoute) {}

  ngOnInit() {    
    
    this.route.params.subscribe(params => {this.mail = params['mail']});

    console.log(" ---------------->   profile ngOnInit");
    console.log(" ---------------->   profile params : " , this.mail);

    var user: TokenPayload = {
      email : this.mail,
      password : ''
    }

    console.log(" ---------------->   profile user prop : " , user.email);

    this.auth.getProfile(user).subscribe(u => {
      this.details = u;
    }, (err) => {
      console.error(err);
    });
  }
}
