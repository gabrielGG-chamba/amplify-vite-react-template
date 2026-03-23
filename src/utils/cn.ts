export const cn = (...classes: (string | number | undefined | null | false)[]) => {
  return classes.filter((c): c is string => typeof c === "string" && c.length > 0).join(" ");
};
