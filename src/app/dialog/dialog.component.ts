import { Component, Inject } from '@angular/core';
import { FormGroup , FormBuilder,Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  FreshList = ["Brand new", "Second hand", "refurbished"];

  actionBtn : string = "save"

  productForm!: FormGroup;

  constructor( private fb : FormBuilder,
     private api : ApiService,
      private dialogref:MatDialogRef<DialogComponent>,
      @Inject(MAT_DIALOG_DATA) public editData : any
      ){

  }

  ngOnInit():void{
    this.productForm = this.fb.group({
      productName : ['',Validators.required],
      category : ['',Validators.required],
      freshness : ['',Validators.required],
      price : ['',Validators.required],
      comment : ['',Validators.required],
      date : ['',Validators.required]
    })

    if(this.editData){
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
    
  }

  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            alert("product added sussesfully");
            this.productForm.reset();
            this.dialogref.close('save');
          },
          error:()=>{
            alert("error while adding product")
          }
        })
      } 
    }else{
      this.updateProduct()
    }
    
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Product updated successfully");
        this.productForm.reset();
        this.dialogref.close('update');
      },
      error:(error)=>{
        alert("Error while updating the product!!");
      }
    })
  }

}
