function triangle(a, typeA, b, typeB) {
  const elements = {
    LEG: "leg",
    HYPOTENUSE: "hypotenuse",
    ADJACENT_ANGLE: "adjacent angle",
    OPPOSITE_ANGLE: "opposite angle",
    ANGLE: "angle",
  };

  if (a <= 0 || b <= 0) {
    return "failed";
  }

  if (
    !Object.values(elements).includes(typeA) ||
    !Object.values(elements).includes(typeB)
  ) {
    console.log(
      "Помилка: Невірний тип аргументів. Будь ласка, перевірте інструкцію."
    );
    return "failed";
  }

  const toRadians = (deg) => deg * (Math.PI / 180);
  const toDegrees = (rad) => rad * (180 / Math.PI);

  let alpha, beta, c;

  switch (true) {
    case typeA === elements.LEG && typeB === elements.LEG:
      console.log(
        "Помилка: Неможливо обчислити трикутник за двома катетами без кута."
      );
      return "failed";

    case typeA === elements.HYPOTENUSE && typeB === elements.HYPOTENUSE:
      console.log(
        "Помилка: Неможливо обчислити трикутник за двома гіпотенузами."
      );
      return "failed";

    case typeA === elements.ANGLE && typeB === elements.ANGLE:
      console.log(
        "Помилка: Неможливо обчислити трикутник за двома кутами без сторін."
      );
      return "failed";

    case typeA === elements.OPPOSITE_ANGLE && typeB === elements.OPPOSITE_ANGLE:
      console.log(
        "Помилка: Неможливо обчислити трикутник за двома протилежними кутами."
      );
      return "failed";

    case typeA === elements.LEG && typeB === elements.LEG:
      c = Math.sqrt(a ** 2 + b ** 2);
      alpha = toDegrees(Math.atan(a / b));
      beta = 90 - alpha;
      break;

    case (typeA === elements.LEG && typeB === elements.HYPOTENUSE) ||
      (typeA === elements.HYPOTENUSE && typeB === elements.LEG):
      c = Math.max(a, b);
      a = Math.min(a, b);
      if (a >= c) {
        console.log(
          "Помилка: Катет не може бути більше або дорівнювати гіпотенузі."
        );
        return "failed";
      }
      b = Math.sqrt(c ** 2 - a ** 2);
      alpha = toDegrees(Math.asin(a / c));
      beta = 90 - alpha;
      break;

    case (typeA === elements.LEG && typeB === elements.ADJACENT_ANGLE) ||
      (typeA === elements.ADJACENT_ANGLE && typeB === elements.LEG):
      a = typeA === elements.LEG ? a : b;
      beta = typeA === elements.ADJACENT_ANGLE ? a : b;
      if (beta <= 0 || beta >= 90) {
        console.log("Помилка: Кут має бути більше за 0° та менше за 90°.");
        return "failed";
      }
      b = a / Math.tan(toRadians(beta));
      c = Math.sqrt(a ** 2 + b ** 2);
      alpha = 90 - beta;
      break;

    case (typeA === elements.LEG && typeB === elements.OPPOSITE_ANGLE) ||
      (typeA === elements.OPPOSITE_ANGLE && typeB === elements.LEG):
      let leg = typeA === elements.LEG ? a : b;
      let angle = typeA === elements.OPPOSITE_ANGLE ? a : b;

      if (angle <= 0 || angle >= 90) {
        console.log("Помилка: Кут має бути більше за 0° та менше за 90°.");
        return "failed";
      }

      if (typeA === elements.LEG) {
        alpha = angle;
        beta = 90 - alpha;
        c = leg / Math.sin(toRadians(alpha));
        b = c * Math.cos(toRadians(alpha));
      }
      if (typeA === elements.OPPOSITE_ANGLE) {
        alpha = angle;
        beta = 90 - alpha;
        c = leg / Math.sin(toRadians(alpha));
        b = c * Math.cos(toRadians(alpha));
        a = c * Math.sin(toRadians(alpha));
      } else {
        beta = angle;
        alpha = 90 - beta;
        c = leg / Math.cos(toRadians(alpha));
        a = c * Math.sin(toRadians(alpha));
      }
      break;

    case (typeA === elements.HYPOTENUSE && typeB === elements.ANGLE) ||
      (typeA === elements.ANGLE && typeB === elements.HYPOTENUSE):
      c = typeA === elements.HYPOTENUSE ? a : b;
      alpha = typeA === elements.ANGLE ? a : b;
      if (alpha <= 0 || alpha >= 90) {
        return "failed";
      }
      a = c * Math.sin(toRadians(alpha));
      b = c * Math.cos(toRadians(alpha));
      beta = 90 - alpha;
      break;

    case (typeA === elements.LEG && typeB === elements.ANGLE) ||
      (typeA === elements.ANGLE && typeB === elements.LEG):
      if (typeA === elements.ANGLE) {
        [a, b, typeA, typeB] = [b, a, typeB, typeA];
      }
      alpha = typeA === elements.ANGLE ? a : b;
      if (alpha <= 0 || alpha >= 90) {
        console.log("Помилка: Кут має бути більше за 0° та менше за 90°.");
        return "failed";
      }
      c = a / Math.cos(toRadians(alpha));
      b = c * Math.sin(toRadians(alpha));
      beta = 90 - alpha;
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

console.clear();
triangle(7, "leg", 18, "hypotenuse");
triangle(60, "opposite angle", 5, "leg");
triangle(43.13, "angle", -2, "hypotenuse");
triangle(4, "leg", 8, "hypotenuse");
triangle(8, "hypotenuse", 4, "leg");
triangle(30, "angle", 5, "leg");
triangle(5, "leg", 30, "angle");
