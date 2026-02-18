function triangle(
  a: number,
  typeA: string,
  b: number,
  typeB: string,
): number | string {
  const elements = {
    LEG: "leg",
    HYPOTENUSE: "hypotenuse",
    ADJACENT_ANGLE: "adjacent angle",
    OPPOSITE_ANGLE: "opposite angle",
    ANGLE: "angle",
  };

  // Додаємо обробку занадто малих / великих сторін
  const MIN_SIDE_LENGTH: number = 0.000001; // Мінімальна довжина сторони
  const MAX_SIDE_LENGTH: number = 1000000; // Максимальна довжина сторони

  if (a <= 0 || b <= 0) {
    console.log(
      "Помилка: Значення сторін має бути більше 0. Будь ласка, перевірте інструкцію.",
    );
    return "failed";
  }
  if (a < MIN_SIDE_LENGTH || b < MIN_SIDE_LENGTH) {
    console.log(
      `Помилка: Значення сторони надто мале. Мінімальне значення ${MIN_SIDE_LENGTH}`,
    );
    return "failed";
  }

  if (a > MAX_SIDE_LENGTH || b > MAX_SIDE_LENGTH) {
    console.log(
      `Помилка: Значення сторони надто велике. Максимальне значення ${MAX_SIDE_LENGTH}`,
    );
    return "failed";
  }

  if (
    !Object.values(elements).includes(typeA) ||
    !Object.values(elements).includes(typeB)
  ) {
    console.log(
      "Помилка: Невірний тип аргументів. Будь ласка, перевірте інструкцію.",
    );
    return "failed";
  }

  const toRadians = (deg: number): number => deg * (Math.PI / 180);
  const toDegrees = (rad: number): number => rad * (180 / Math.PI);

  let alpha: number, beta: number, c: number;

  switch (true) {
    case typeA === elements.HYPOTENUSE && typeB === elements.HYPOTENUSE:
      console.log(
        "Помилка: Неможливо обчислити трикутник за двома гіпотенузами.",
      );
      return "failed";

    case typeA === elements.ANGLE && typeB === elements.ANGLE:
      console.log(
        "Помилка: Неможливо обчислити трикутник за двома кутами без сторін.",
      );
      return "failed";

    case typeA === elements.OPPOSITE_ANGLE && typeB === elements.OPPOSITE_ANGLE:
      console.log(
        "Помилка: Неможливо обчислити трикутник за двома протилежними кутами.",
      );
      return "failed";

    case typeA === elements.LEG && typeB === elements.LEG:
      c = Math.sqrt(a ** 2 + b ** 2);
      alpha = toDegrees(Math.atan(a / b));
      beta = 90 - alpha;
      break;

    case (typeA === elements.LEG && typeB === elements.HYPOTENUSE) ||
      (typeA === elements.HYPOTENUSE && typeB === elements.LEG):
      c = typeA === elements.HYPOTENUSE ? a : b;
      let leg: number = typeA === elements.LEG ? a : b;

      if (leg >= c) {
        console.log(
          "Помилка: Катет не може бути більше або дорівнювати гіпотенузі.",
        );
        return "failed";
      }
      b = Math.sqrt(c ** 2 - leg ** 2);
      alpha = toDegrees(Math.asin(leg / c));
      beta = 90 - alpha;
      if (typeA === elements.HYPOTENUSE) {
        a = Math.sqrt(c ** 2 - leg ** 2);
        b = leg;
      } else {
        a = leg;
      }

      break;

    case (typeA === elements.LEG && typeB === elements.ADJACENT_ANGLE) ||
      (typeA === elements.ADJACENT_ANGLE && typeB === elements.LEG):
      let legAdj: number = typeA === elements.LEG ? a : b;
      beta = typeA === elements.ADJACENT_ANGLE ? a : b;

      if (beta <= 0 || beta >= 90) {
        console.log("Помилка: Кут має бути більше за 0° та менше за 90°.");
        return "failed";
      }
      // Виправлення тут: використовуємо тангенс для обчислення протилежного катета
      b = legAdj * Math.tan(toRadians(beta));
      c = Math.sqrt(legAdj ** 2 + b ** 2);
      alpha = 90 - beta;
      a = legAdj;
      break;

    case (typeA === elements.LEG && typeB === elements.OPPOSITE_ANGLE) ||
      (typeA === elements.OPPOSITE_ANGLE && typeB === elements.LEG):
      let legOpp: number = typeA === elements.LEG ? a : b;
      let angle: number = typeA === elements.OPPOSITE_ANGLE ? a : b;

      if (angle <= 0 || angle >= 90) {
        console.log("Помилка: Кут має бути більше за 0° та менше за 90°.");
        return "failed";
      }

      if (typeA === elements.LEG) {
        alpha = angle;
        beta = 90 - alpha;
        c = legOpp / Math.sin(toRadians(alpha));
        b = c * Math.cos(toRadians(alpha));
        a = legOpp;
      } else {
        alpha = angle;
        beta = 90 - alpha;
        c = legOpp / Math.sin(toRadians(alpha));
        a = c * Math.sin(toRadians(alpha));
        b = c * Math.cos(toRadians(alpha));
      }
      break;

    case (typeA === elements.HYPOTENUSE && typeB === elements.ANGLE) ||
      (typeA === elements.ANGLE && typeB === elements.HYPOTENUSE):
      c = typeA === elements.HYPOTENUSE ? a : b;
      alpha = typeA === elements.ANGLE ? a : b;
      if (alpha <= 0 || alpha >= 90) {
        console.log("Помилка: Кут має бути більше за 0° та менше за 90°.");
        return "failed";
      }
      a = c * Math.sin(toRadians(alpha));
      b = c * Math.cos(toRadians(alpha));
      beta = 90 - alpha;
      break;

    case (typeA === elements.LEG && typeB === elements.ANGLE) ||
      (typeA === elements.ANGLE && typeB === elements.LEG):
      let alphaAngle: number = typeA === elements.ANGLE ? a : b;
      let legAngle: number = typeA === elements.LEG ? a : b;
      if (alphaAngle <= 0 || alphaAngle >= 90) {
        console.log("Помилка: Кут має бути більше за 0° та менше за 90°.");
        return "failed";
      }
      alpha = alphaAngle;
      beta = 90 - alpha;
      c = legAngle / Math.cos(toRadians(alpha));
      b = c * Math.sin(toRadians(alpha));
      a = legAngle;
      break;

    default:
      console.log("Помилка: Некоректне поєднання типів аргументів.");
      return "failed";
  }

  console.log("a =", a);
  console.log("b =", b);
  console.log("c =", c);
  console.log("alpha =", alpha);
  console.log("beta =", beta);
  console.log("\n");
  return "success";
}
