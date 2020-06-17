export interface student {
  accessToken: string;
  createdAt: string;
  department: department;
  exam: exam;
  faculty: faculty;
  matric: string;
  name: string;
  status: boolean;
  updatedAt: Date;
  __v?: number;
  _id: string;
};

export interface department {
  status: boolean;
  _id: string;
  department: string;
  faculty: string;
  createdAt: Date;
};

export interface faculty {
  status: boolean;
  _id: string;
  faculty: string;
  createdAt: string;
  updatedAt: string;
};

interface exam {
  inProgress: boolean;
  answered: [];
  questions: [];
};

