import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';

@Component({
  selector: 'password-strength',
  styleUrls: ['./password-strength.component.scss'],
  templateUrl: './password-strength.component.html',
})
export class PasswordStrengthComponent implements OnChanges {
  bar0!: string;
  bar1!: string;
  bar2!: string;


  @Input() public passwordToCheck?:string | null;

  @Output() passwordStrength = new EventEmitter<boolean>();

  private colors = ['red', 'gold', 'green'];

  message?: string;
  messageColor?: string;

  checkStrength(password: string) {
    let force = 0;

    const easy = /^[a-zA-z]+$|^[0-9]+$|^[^a-zA-Z0-9]+$/.test(password);
    const medium = /(^[\w\d]+$)|(^[^0-9]+$)|(^[^a-zA-Z]+$)/gi.test(password);
    const strong = /(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/g.test(password);


    let passedMatches = 0;
    easy ? passedMatches += 1 : medium ? passedMatches += 2 : strong ? passedMatches += 3 : null

    force += password.length < 8 ? 0 : passedMatches;


    return force;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;

    this.setBarColors(3, '#DDD');

    if (password) {
      const color = this.getColor(this.checkStrength(password));
      this.setBarColors(color.index, color.color);

      const pwdStrength = this.checkStrength(password);
      pwdStrength === 30 ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);

      switch (pwdStrength) {
        case 0: 
          this.message = '';
          break
        case 1:
          this.message = 'Easy';
          break;
        case 2:
          this.message = 'Medium';
          break;
        case 3:
          this.message = 'Strong';
          break;
      }
    } else {
      this.message = '';
    }
  }

  private getColor(strength: number) {
    let index = 0;

    if(!strength) {
      return {
        index: 3,
        color: this.colors[0],
      };
    }

    index = strength - 1

    this.messageColor = this.colors[index];

    return {
      index: index + 1,
      color: this.colors[index],
    };
  }

  private setBarColors(count: number, color: string) {
    for (let i = 0; i < count; i++) {
      (this as any)['bar' + i] = color;
    }
  }
}