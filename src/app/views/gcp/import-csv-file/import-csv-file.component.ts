import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { of } from 'rxjs';
import { Gcp } from 'src/app/gcp-structure';
import { GcpService } from 'src/app/services/gcp.service';
import {MatSnackBar} from '@angular/material/snack-bar';


// import * as $ from 'jquery'
const $ = require('jquery')



@Component({
  selector: 'import-csv-file',
  templateUrl: './import-csv-file.component.html',
  styleUrls: ['./import-csv-file.component.css']
})
export class ImportCsvFileComponent {
  csvRecords: any;
  gcpRecords: Gcp[] = [];
  header: boolean = true;

  constructor(private ngxCsvParser: NgxCsvParser,
     private gcpService: GcpService,
     private _snackBar: MatSnackBar
    ) {
  }

  @ViewChild('csvFileInput') csvFileInput: any;

  fileChangeListener($event: HTMLInputElement): void {

    const files: FileList = $event.files!;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe({
        next: (result): void => {
          console.log('Result', result);
          this.csvRecords = result;
          this.gcpRecords = []
          this.saveData();
        },
        error: (error: NgxCSVParserError): void => {
          console.log('Error', error);
        }
      });
  }

  private saveData() {
    try {
      for (const rec of this.csvRecords) {
        this.gcpRecords.push(this.validateCsvRow(rec));   
      }
      this.gcpService.addGcps(this.gcpRecords);


    } catch (error) {
      this._snackBar.open(String(error), 'X', {
        duration: 20000
      });
      console.error('csv Error', error);

    }
  }

  uploadCsvFileBtnClick() {
    $("#importCsvFileInput").click();
  }

  validateCsvRow(row: Gcp) {
    if (!('name' in row && 'n' in row && 'e' in row && 'h' in row)) {
      throw new Error('File header can contain only "name n e h", the record '+JSON.stringify(row)+' is invalid')
    }
    if (typeof row.name !== 'string') {
      throw new Error('name must be a string, the record '+JSON.stringify(row)+' is invalid')
    }
    const n = Number(row.n)
    if (isNaN(n)) {
      throw new Error('n must be a number, the record '+JSON.stringify(row)+' is invalid')
    }
    const e = Number(row.e)
    if (isNaN(e)) {
      throw new Error('e must be a number, the record '+JSON.stringify(row)+' is invalid')
    }
    const h = Number(row.h)
    if (isNaN(h)) {
      throw new Error('h must be a number')
    }

    const result = { name: row.name, n, e, h }
    return result
  }
}
