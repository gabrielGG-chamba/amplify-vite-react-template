type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export const cn = (...classes: ClassValue[]): string => {
  return classes
    .flat()
    .filter((c): c is string | number => typeof c === "string" || typeof c === "number")
    .join(" ");
};
