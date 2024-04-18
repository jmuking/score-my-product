//Context Types
export interface ModalState {
  open: boolean;
  title: string;
  text: string;
  cancelText: string;
  confirmText: string;
  showCancel: boolean;
  showConfirm: boolean;
  modalType: ModalType;
  inputData?: any;
  confirmAction?: (actionResult: any) => void;
}

export enum ModalType {
  BASIC = "basic",
  LOGIN = "login",
  EDIT_POST = "edit_post",
}

export interface UserState {
  loggedIn: boolean;
  userName?: string;
}

export interface ApiData {
  product?: Product;
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
  id?: string; // id if we get from API
}

export interface Product {
  code: string;
  label: string;
}
