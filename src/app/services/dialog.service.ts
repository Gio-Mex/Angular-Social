import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dialogTitle!: string;
  field1Label!: string;
  field1!: string;
  field2Label!: string;
  field2!: string;
  field3Label!: string;
  field3!: string;
  userId!: string;
  postId!: string;
  constructor() {}
}
