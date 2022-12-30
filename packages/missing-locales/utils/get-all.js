import path from "path";
import missingLocales from "../dist/index.js";

console.log("START");

console.log(
  "\nlocales_empty\n",
  missingLocales(path.resolve("../../", "mock", "./locales_empty")),
  "\n----------------------------------\n",
);

console.log(
  "\nlocale\n",
  missingLocales(path.resolve("../../", "mock", "./locales_single-locale")),
  "\n----------------------------------\n",
);

console.log(
  "\nlocales_regular\n",
  missingLocales(path.resolve("../../", "mock", "./locales_regular")),
  "\n----------------------------------\n",
);

console.log(
  "\nboth\n",
  missingLocales(path.resolve("../../", "mock", "./locales_missed-both")),
  "\n----------------------------------\n",
);

console.log(
  "\nns\n",
  missingLocales(path.resolve("../../", "mock", "./locales_some-ns")),
  "\n----------------------------------\n",
);

console.log(
  "\nlocales_nested\n",
  missingLocales(path.resolve("../../", "mock", "./locales_nested")),
  "\n----------------------------------\n",
);

console.log(
  "\nlocales_more-languages\n",
  missingLocales(path.resolve("../../", "mock", "./locales_more-languages")),
  "\n----------------------------------\n",
);

console.log("DONE");
