import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StaffTask} from '../model/staff-task';
import {TaskService} from '../service/task.service';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {Team} from '../model/team';
import {StaffBase} from '../model/staff-base';
import {AuthService} from '../service/auth.service';
import {TeamService} from '../service/team.service';
import {StaffService} from '../service/staff.service';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {TaskDto} from '../model/task-dto';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatDialog} from '@angular/material/dialog';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-task',
  imports: [
    ReactiveFormsModule,
    MatDivider,
    MatIcon,
    MatSlideToggle,
    FormsModule,
    MatAccordion,
    MatCheckbox,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatRadioButton,
    MatRadioGroup,
    MatSelectionList,
    MatListOption,
    MatProgressSpinner,
    RouterLink
  ],
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit{


  teams:Team[]=[];
  teamDetails = new FormGroup({
    teamName: new FormControl(''),
    teamMembers: new FormControl(['']),
    teamLeader: new FormControl('')
  });
  staffs: StaffBase[] = [];
  listFiltered: StaffBase[] = this.staffs;
  allTeams:Team[]=[];

  tasks:Array<StaffTask>=[];
  taskDetails = new FormGroup({
    taskTittle: new FormControl(''),
    taskDescription: new FormControl(''),
    // modules: new FormArray<FormGroup>([this.moduleGroup]),
    modules: new FormArray([new FormGroup({moduleName: new FormControl('')})]),
    enableTeamCreate: new FormControl(false),
    createOrAssign: new FormControl('')
  })

  teamAssignOrCreateOptions = ['New Team','Assign Existing'];

  constructor(private taskService:TaskService,private authService:AuthService,private teamService:TeamService,private staffService:StaffService,private matDialog:MatDialog) {
  }

  ngOnInit(): void {
    let ts = this.taskService.getAllTask();
    if(ts != null) {
      ts.subscribe(res => {
        this.tasks = res;
      })
    }else {
      console.log("unable to fetch")
    }
    this.teamService.getAllTeams()
      .subscribe(res => {
        this.allTeams = res;
      })
    if(this.authService.isAdministrator()) {
      this.teams = this.allTeams;
    }else if(this.authService.isAuthenticated()){
      this.teamService.getMyTeams()
        .subscribe(res => {
          this.teams = res;
        })
    }
    this.staffService.getAllStaffBasic()
      .subscribe(res => {
        this.staffs = res;
        this.listFiltered = this.staffs;
      })
  }

  createTask(){

    let taskTittle = this.taskDetails.controls.taskTittle.value;
    let taskDescription = this.taskDetails.controls.taskDescription.value;
    let moduleList = this.taskDetails.controls.modules.value;
    let teName = this.teamDetails.controls.teamName.value;
    let teamLeaderId = this.teamDetails.controls.teamLeader.value;
    let teamMembersIds = this.teamDetails.controls.teamMembers.value;
    let enableTeam = this.taskDetails.controls.enableTeamCreate.value;
    let createAssign = this.taskDetails.controls.createOrAssign.value;
    let modules:string[] = [];
    moduleList.forEach(m => {
      if(m != null && m.moduleName != null && m.moduleName != ''){
        modules.push(m.moduleName)
      }
    });

    if(taskTittle != null && taskTittle != '' && taskDescription != null && taskDescription != '' && modules.length != 0){
      let task:TaskDto;

      if(enableTeam) {
        if (createAssign == 'New Team') {
          if (teName != null && teamLeaderId != null && teamMembersIds != null &&
            teName != '' && teamLeaderId != '') {
            teamMembersIds = teamMembersIds.filter(s => s != '');
            if (teamMembersIds.length == 0) {
              console.log("Please Select Staffs")
            } else {
              task = new TaskDto(
                taskTittle,
                taskDescription,
                modules,
                teamMembersIds,
                teamLeaderId,
                teName
              )
              console.log(task);
              this.postCreateTask(task);
            }
          } else {
            console.log("Fill all details")
          }
        }else if(createAssign == 'Assign Existing'){

        }else{
          console.log("Choose one or remove team");
        }
      }else{
        task = new TaskDto(
          taskTittle,
          taskDescription,
          modules,
          [],'',''
        )

        console.log(task);

        this.postCreateTask(task);
      }

    }else{
      console.log('fill all details');
    }

  }


  addMore() {
    this.taskDetails.controls.modules.push(new FormGroup({moduleName:new FormControl('')}));
  }


  removeModule($index: number) {
    this.taskDetails.controls.modules.removeAt($index);
  }


  filterList(event:any) {
    let query = event.target.value;
    this.listFiltered = this.staffs.filter(st =>
      st.staffName.toLowerCase().includes(query.toLowerCase())
    );
  }

  checkChange(event:any) {
    let valueId = event.target.value;
    if(event.target.checked){
      this.teamDetails.controls.teamMembers.value?.push(valueId);
    }else{
      let list= this.teamDetails.controls.teamMembers.value;
      if(list != null){
        this.teamDetails.controls.teamMembers.setValue(list.filter(v => v!=valueId))
      }

    }
  }


  postCreateTask(task:TaskDto){
    this.taskService.createTask(task).subscribe(res => {
      console.log(res);
    });
  }

}
