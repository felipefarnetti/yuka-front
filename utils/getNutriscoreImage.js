export default function getNutriscoreImage(grade) {
  const nutriscore = grade ? grade : null;
  return nutriscore === "a"
    ? require("../assets/nutriscore-a.png")
    : nutriscore === "b"
    ? require("../assets/nutriscore-b.png")
    : nutriscore === "c"
    ? require("../assets/nutriscore-c.png")
    : nutriscore === "d"
    ? require("../assets/nutriscore-d.png")
    : nutriscore === "e"
    ? require("../assets/nutriscore-e.png")
    : require("../assets/nutriscore-na.png");
}
