import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular13crud';

  displayedColumns: string[] = ['productName', 'category', 'freshness', 'price','comment','date','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private dialog : MatDialog, private api : ApiService){

  }
  ngOnInit(): void {
    this.getAllProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width:"35%"
    }).afterClosed().subscribe(val =>{
      if(val === 'save'){
        this.getAllProducts();
      }
    })
}

getAllProducts(){
  this.api.getProduct()
  .subscribe({
    next:(res)=>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
    },
    error:()=>{
      alert("Error while fetching the record!!!");
    }
  })
}

editProduct(roww:any){
  this.dialog.open(DialogComponent,{
    width:'30%',
    data:roww
  }).afterClosed().subscribe(val =>{
    if(val === 'update'){
      this.getAllProducts();
    }
  })
}

deleteProduct(id : number){
  this.api.deleteProduct(id)
  .subscribe({
    next:(res)=>{
      alert("deleted successfully!!");
      this.getAllProducts();
    },
    error:(er)=>{
      alert("Error while deleting the record");
    }
  })
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

}