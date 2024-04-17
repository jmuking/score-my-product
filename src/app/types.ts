//Context Types
export interface ModalState {
  open: boolean;
  title: string;
  text: string;
  cancelText: string;
  confirmText: string;
  showCancel: boolean;
  askForInput?: boolean;
  confirmAction?: (actionResult: any) => void;
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
}

export interface Product {
  code: string;
  label: string;
}
