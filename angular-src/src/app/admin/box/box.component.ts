import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminBox } from '../../models/admin.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {
  
  @Input() image: string;
  // image: string;
  // "../../assets/images/user.jpeg"

  constructor(private router: Router, private route: ActivatedRoute) {
    // this.image = this.route.snapshot.data['provaAncora'];
    // console.log(this.image);
  }

  ngOnInit() {
  }

  manage() {
    if(this.image.includes('user')) {
      this.router.navigateByUrl('/admin/management/users');
    } else if(this.image.includes('sensor')) {
      this.router.navigateByUrl('/admin/management/sensors');
    } else {
      this.router.navigateByUrl('/admin/management/charts');
    }    
  }

}
