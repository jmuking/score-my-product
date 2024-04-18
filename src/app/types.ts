//Context Types
export interface ModalState {
  open: boolean;
  title: string;
  text: string;
  cancelText: string;
  confirmText: string;
  showCancel: boolean;
  modalType: ModalType;
  inputData?: any;
  confirmAction?: (actionResult: any) => void;
}

export enum ModalType {
  BASIC = "basic",
  LOGIN = "login",
  CREATE_POST = "create_post",
}

export interface UserState {
  loggedIn: boolean;
  userName?: string;
}

export interface ApiData {
  product?: string;
  posts?: any[];
  scores?: any[];
}

// Data Types
export interface Post {
  country: string;
  product: string;
  score: number;
  comment: string;
  user: string;
}

export interface Product {
  code: string;
  label: string;
}
