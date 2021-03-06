export interface Item {
  id: number;
  name: string;
  thumbnailImage: string;
  highResImage?: string;
  description: string;
  url: string;
  source: string;
}

export interface List {
  id?: string;
  title: string;
  user: User;
  collection: Item[];
  creationDate: Date;
  updateDate: Date;
  description: string;
  isPrivate: boolean;
}

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

export interface UrlInfo {
  url: string;
  name: string;
  favicon?: string;
  description?: string;
  image?: string;
  author?: string;
}
