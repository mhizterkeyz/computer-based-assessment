export const facultyAlphabeticalSortFn = (a: any, b: any) =>
  a.faculty > b.faculty ? 1 : a.faculty < b.faculty ? -1 : 0;

export const departmentAlphabeticalSortFn = (a: any, b: any) =>
  a.department > b.department ? 1 : a.department < b.department ? -1 : 0;

export const matricAscendingSortFn = (a: any, b: any) =>
  a.matric > b.matric ? 1 : a.matric < b.matric ? -1 : 0;

  export const matricDescendingSortFn = (a: any, b: any) =>
  a.matric < b.matric ? 1 : a.matric > b.matric ? -1 : 0;

export const levelSortFn = (a: any, b: any) =>
  a.level < b.level ? 1 : a.level > b.level ? -1 : 0;
