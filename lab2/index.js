// 1.2.3 Створення об'єкта car1 за допомогою new Object()
const car1 = new Object();
car1.color = "red";
car1.maxSpeed = 200;
car1.driver = new Object();
car1.driver.name = "Іван Петров";
car1.driver.category = "C";
car1.driver.personalLimitations = "No driving at night";
car1.tuning = true;
car1.numberOfAccidents = 0;

// 1.2.4 Створення об'єкта car2 за допомогою синтаксису літерала об'єкта
const car2 = {
  color: "blue",
  maxSpeed: 180,
  driver: {
    name: "Іван Петров",
    category: "B",
    personalLimitations: null,
  },
  tuning: false,
  numberOfAccidents: 2,
};

// 1.2.5 Додавання методу drive до об'єкта car1
car1.drive = function () {
  console.log("I am not driving at night");
};

// 1.2.6 Додавання методу drive до об'єкта car2
car2.drive = function () {
  console.log("I can drive anytime");
};

// 1.2.7 Конструктор для «класу» Truck
function Truck(color, weight, avgSpeed, brand, model) {
  this.color = color;
  this.weight = weight;
  this.avgSpeed = avgSpeed;
  this.brand = brand;
  this.model = model;

  // 1.2.9 Метод trip для «класу» Truck
  this.trip = function () {
    if (!this.driver) {
      console.log("No driver assigned");
    } else {
      console.log(
        `Driver ${this.driver.name} ${
          this.driver.nightDriving
            ? "drives at night"
            : "does not drive at night"
        } and has ${this.driver.experience} years of experience.`
      );
    }
  };
}

// 1.2.8 «Статичний» метод AssignDriver для «класу» Truck
Truck.prototype.AssignDriver = function (name, nightDriving, experience) {
  this.driver = {
    name,
    nightDriving,
    experience,
  };
};

// 1.2.10 Створення об'єктів «класу» Truck та демонстрація методу trip
const truck1 = new Truck("white", 5000, 80, "Volvo", "FH16");
const truck2 = new Truck("black", 7000, 70, "MAN", "TGX");

truck1.AssignDriver("Іван Петров", true, 10);
truck2.AssignDriver("Петро Іванов", false, 5);

truck1.trip();
truck2.trip();

// 1.2.12 Клас Square
class Square {
  constructor(a) {
    this.a = a;
  }

  static help() {
    console.log("Квадрат - це чотирикутник з рівними сторонами та кутами.");
  }

  length() {
    console.log(`Довжина сторін квадрата: ${this.a * 4}`);
  }

  square() {
    console.log(`Площа квадрата: ${this.a ** 2}`);
  }

  info() {
    console.log(`Сторони квадрата: ${this.a}, ${this.a}, ${this.a}, ${this.a}`);
    console.log("Кути квадрата: 90, 90, 90, 90");
    this.length();
    this.square();
  }
}

// 1.2.16 Клас Rectangle
class Rectangle extends Square {
  constructor(a, b) {
    super(a);
    this.b = b;
  }

  static help() {
    console.log(
      "Прямокутник - це чотирикутник з протилежними рівними сторонами та прямими кутами."
    );
  }

  length() {
    console.log(`Довжина сторін прямокутника: ${2 * (this.a + this.b)}`);
  }

  square() {
    console.log(`Площа прямокутника: ${this.a * this.b}`);
  }

  info() {
    console.log(
      `Сторони прямокутника: ${this.a}, ${this.b}, ${this.a}, ${this.b}`
    );
    console.log("Кути прямокутника: 90, 90, 90, 90");
    this.length();
    this.square();
  }
}

// 1.2.18 Клас Rhombus
class Rhombus extends Square {
  constructor(a, alpha, beta) {
    super(a);
    this.alpha = alpha;
    this.beta = beta;
  }

  static help() {
    console.log(
      "Ромб - це чотирикутник з рівними сторонами та протилежними рівними кутами."
    );
  }

  square() {
    console.log(
      `Площа ромба: ${this.a ** 2 * Math.sin((this.alpha * Math.PI) / 180)}`
    );
  }

  info() {
    console.log(`Сторони ромба: ${this.a}, ${this.a}, ${this.a}, ${this.a}`);
    console.log(
      `Кути ромба: ${this.alpha}, ${this.beta}, ${this.alpha}, ${this.beta}`
    );
    this.length();
    this.square();
  }
}

// 1.2.20 Клас Parallelogram
class Parallelogram extends Rectangle {
  constructor(a, b, alpha, beta) {
    super(a, b);
    this.alpha = alpha;
    this.beta = beta;
  }

  static help() {
    console.log(
      "Паралелограм - це чотирикутник з протилежними рівними сторонами та протилежними рівними кутами."
    );
  }

  square() {
    console.log(
      `Площа паралелограма: ${
        this.a * this.b * Math.sin((this.alpha * Math.PI) / 180)
      }`
    );
  }

  info() {
    console.log(
      `Сторони паралелограма: ${this.a}, ${this.b}, ${this.a}, ${this.b}`
    );
    console.log(
      `Кути паралелограма: ${this.alpha}, ${this.beta}, ${this.alpha}, ${this.beta}`
    );
    this.length();
    this.square();
  }
}

// 1.2.22 Гетери та сетери для класу Rhombus
Object.defineProperty(Rhombus.prototype, "a", {
  get: function () {
    return this._a;
  },
  set: function (value) {
    this._a = value;
  },
});

Object.defineProperty(Rhombus.prototype, "alpha", {
  get: function () {
    return this._alpha;
  },
  set: function (value) {
    this._alpha = value;
  },
});

Object.defineProperty(Rhombus.prototype, "beta", {
  get: function () {
    return this._beta;
  },
  set: function (value) {
    this._beta = value;
  },
});

// 1.2.23 Виклик статичного методу help для кожного з класів
Square.help();
Rectangle.help();
Rhombus.help();
Parallelogram.help();

// 1.2.24 Створення об'єктів та виклик методу info
const square = new Square(5);
const rectangle = new Rectangle(4, 6);
const rhombus = new Rhombus(5, 120, 60);
const parallelogram = new Parallelogram(4, 6, 120, 60);

square.info();
rectangle.info();
rhombus.info();
parallelogram.info();

// 1.2.25 Функція Triangular
function Triangular(a = 3, b = 4, c = 5) {
  return { a, b, c };
}

// 1.2.26 Створення об'єктів за допомогою функції Triangular
const triangle1 = Triangular(); // Значення за замовчуванням
const triangle2 = Triangular(6, 8, 10);
const triangle3 = Triangular(5, 12, 13);

// Виведення об'єктів у консоль
console.log(triangle1);
console.log(triangle2);
console.log(triangle3);

// 1.2.27 Функція PiMultiplier
function PiMultiplier(number) {
  return function () {
    return Math.PI * number;
  };
}

// 1.2.28 Створення функцій за допомогою PiMultiplier
const multiplyPiBy2 = PiMultiplier(2);
const multiplyPiBySqrt3 = PiMultiplier(Math.sqrt(3));
const dividePiBy2 = PiMultiplier(0.5);

// Виведення результатів у консоль
console.log(multiplyPiBy2());
console.log(multiplyPiBySqrt3());
console.log(dividePiBy2());

// 1.2.29 Функція Painter
function Painter(color) {
  return function (obj) {
    if (obj.type) {
      console.log(`Object painted ${color}: ${obj.type}`);
    } else {
      console.log("No 'type' property occurred!");
    }
  };
}

// 1.2.30 Створення функцій за допомогою Painter
const PaintBlue = Painter("blue");
const PaintRed = Painter("red");
const PaintYellow = Painter("yellow");

// 1.2.31 Демонстрація роботи функцій PaintBlue, PaintRed та PaintYellow
const obj1 = { maxSpeed: 280, type: "Sportcar" };
const obj2 = { avgSpeed: 90, color: "purple" };
const obj3 = { color: "magenta", loadCapacity: 2400, isCar: true };

PaintBlue(obj1);
PaintRed(obj2);
PaintYellow(obj3);
