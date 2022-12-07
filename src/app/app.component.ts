import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { EMPTY, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currentInstanceID !: string;
  membersData : any = [];

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {}

  getData(){
    this.getMembers().pipe(
      tap(console.log),
      switchMap((resp:any)=>{
        return of(resp[0]);
      })
    ).subscribe(async (data:any)=>{
      this.currentInstanceID = data.id;
      const members = data.data.members
      this.membersData = [];
      for (let i=0; i<members.length; i++){
        var no_of_proptions : any = [];
        console.log("-- CAlling Member --");
        if(i<2){
          no_of_proptions = await this.getDataFromPlans(members[i].plan_data);
          console.log("Plan Data",i,no_of_proptions);
        }
        this.membersData.push({
          firstName: members[i].givenName,
          lastName: members[i].surname,
          jobTitle: members[i].jobTitle || "no_title",
          no_of_proptions : no_of_proptions
        });
      }
      console.log(this.membersData);
    });
  }

  getMembers(){
    return this._http.get('https://622ede985c86fd315eb6cb9e.mockapi.io/users');
  }

 async getDataFromPlans(plans : any){
  const res : any = [];
  for(let i=0;i<plans.length;i++){
    await this._http
      .get<any>(`https://622ede985c86fd315eb6cb9e.mockapi.io/teachers/${plans[i].plan_id}`)
      .toPromise()
      .then((data: any) => {
        res.push(data.data[plans[i].plan_id]);
      });
  }
  return res;
 }
}
