'use strict';

///// functional class

const Person = function(firstName, birthYear) {
  this.firstName = firstName;
  this.birthYear = birthYear;
}
Person.prototype.calcAge = function() { console.log(2000 - this.birthYear); }
Person.prototype.species = 'Human';
Person.greet = function() { console.log('hey'); }

const person1 = new Person('Amanda', 1990);

console.log(person1); // Person object with firstName of Amanda and birthYear of 1990, __proto__ object
console.log(person1 instanceof Person); // true
person1.calcAge(); // logs out 10
console.log(person1.species); // Human

console.log(person1.hasOwnProperty('firstName')); // true
console.log(person1.hasOwnProperty('species')); // false, because species is not on the object itself, it's a prototype property

Person.greet();

// inheritance

const Student = function(firstName, birthYear, course) {
  Person.call(this, firstName, birthYear);
  this.course = course;
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;
Student.prototype.introduce = function() { console.log(`the students name is ${this.firstName}`); }

const student1 = new Student('Mike', 1990, 'math');
console.log(student1);
student1.calcAge();


///////////

const Car = function(make, speed) {
  this.currentSpeed = speed;
  this.make = make;
}
Car.prototype.accelerate = function() {
  this.currentSpeed += 10;
}
Car.prototype.brake = function() {
  this.currentSpeed -= 5;
}

const car = new Car('Buick', 100);
car.accelerate(); // 110
car.brake(); // 105


///// Classes

console.log('----------------------------classes');

class PersonClass {
  language = 'English'; // public field
  _language = 'English'; // protected field
  #ssn; // private field

  static age = 24; // class field

  constructor(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
    this.#ssn = '1234';
  }

  calcAge() { console.log(2000 - this.birthYear); }

  #privateMethod() { console.log('I am private'); }
  _protectedMethod() { console.log('I am protected'); }

  get firstName() { return this._firstName; }
  set firstName(name) { this._firstName = name; }

  get fullName() { return this._fullName; }
  set fullName(name) {
    if(!name.includes(' ')) {
      console.log('not a full name');
    } else {
      this._fullName = name;
    }
  }

  static greet() { console.log('hey'); } // class function
}
const person = new PersonClass('Amanda', 1990);
person.calcAge(); // logs out 10
console.log(person.firstName); // Amanda
person.firstName = 'Sarah';
console.log(person.firstName);
person.fullName = 'Bob Me';
console.log(person.fullName);
console.log(person);

PersonClass.greet();
console.log(PersonClass.age);

/// inheritance

class StudentClass extends PersonClass {
  constructor(firstName, birthYear, course) {
    super(firstName, birthYear)
    this.course = course;
  }

  get course() { return this._course; }
  set course(course) { this._course = course }

  introduce() { console.log(`the students name is ${this.firstName}`); }
}

const student = new StudentClass('Amanda', 1990, 'science');
console.log(student.course);
student.introduce();
student.calcAge();

////

class CarClass {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  get speedUS() { return this.speed / 1.6; }
  set speedUS(newSpeed) { this.speed = newSpeed * 1.6; }

  accelerate() { this.speed += 10; console.log(this.speed); }
  brake() { this.speed -= 5; console.log(this.speed); }
}

const car1 = new CarClass('buick', 100)
console.log(car1.speedUS);
car1.accelerate();
car1.brake();
console.log(car1.speedUS);


/////// object create

console.log('----------------object create');

const PersonProto = {
  calcAge() { console.log(2000 - this.birthYear); },
  init(firstName, birthYear) {
    this.firstName = firstName,
    this.birthYear = birthYear;
  },
}
const o = Object.create(PersonProto);
o.init('Amanda', 1990);
console.log(o); // an object with firstName Amanda, birthYear 1990, calcAge in __proto__

// inheritance

const StudentProto = Object.create(PersonProto);
StudentProto.init = function(firstName, birthYear, course) {
  PersonProto.init.call(this, firstName, birthYear);
  this.course = course;
}

const person2 = Object.create(StudentProto);
person2.init('Amanda', 1991, 'science');
console.log(person2);
person2.calcAge();


