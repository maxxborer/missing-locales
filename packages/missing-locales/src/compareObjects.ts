export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue>;

const getExecutedValue = (obj: any): string => {
  const isObject = obj && typeof obj === "object"; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  const isArray = obj && Array.isArray(obj); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  const value = isObject && !isArray ? `{${Object.keys(obj as object).join(", ")}}` : String(obj);
  return value;
};

export default function compareObjects(obj1: any, obj2: any): { missingInFirst: string[]; missingInSecond: string[] } {
  if (obj1 === null || obj1 === undefined) {
    const value = getExecutedValue(obj2);
    return { missingInFirst: [value], missingInSecond: [] };
  } else if (obj2 === null || obj2 === undefined) {
    const value = getExecutedValue(obj1);
    return { missingInFirst: [], missingInSecond: [value] };
  }

  const missingInFirst: string[] = [];
  const missingInSecond: string[] = [];

  // Сравниваем ключи на первом уровне вложенности
  for (const key in obj1) {
    if (!(key in obj2)) {
      missingInSecond.push(key);
    }
  }
  for (const key in obj2) {
    if (!(key in obj1)) {
      missingInFirst.push(key);
    }
  }

  // Сравниваем вложенные объекты и массивы
  for (const key in obj1) {
    if (typeof obj1[key] === "object" && obj1[key] !== null) {
      if (Array.isArray(obj1[key])) {
        // Сравниваем массивы
        for (let i = 0; i < obj1[key].length; i++) {
          const path1 = obj1[key][i] as JSONValue;
          const path2 = obj2[key][i] as JSONValue;
          if (typeof path1 === "object" && path1 !== null) {
            // Сравниваем вложенные объекты
            const result = compareObjects(path1, path2);
            // FIXME:
            // @ts-ignore
            missingInFirst.push(...result.missingInFirst.map((k) => `${key}[${i}].${k}:${path2[k]}`)); // eslint-disable-line @typescript-eslint/restrict-template-expressions
            // @ts-ignore
            missingInSecond.push(...result.missingInSecond.map((k) => `${key}[${i}].${k}:${path1[k]}`)); // eslint-disable-line @typescript-eslint/restrict-template-expressions
          } else {
            if (!obj2[key] || path1 !== path2) {
              missingInSecond.push(`${key}[${i}]:${String(path1)}`);
            }
            if (!obj1[key] || path1 !== path2) {
              missingInFirst.push(`${key}[${i}]:${String(path2)}`);
            }
          }
        }
      } else {
        // Сравниваем объекты
        const result = compareObjects(obj1[key], obj2[key]);
        missingInFirst.push(...result.missingInFirst.map((k) => `${key}{}.${k}`));
        missingInSecond.push(...result.missingInSecond.map((k) => `${key}{}.${k}`));
      }
    }
  }

  return { missingInFirst, missingInSecond };
}
