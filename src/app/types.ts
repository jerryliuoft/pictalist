export interface Item {
  id: number;
  name: string;
  thumbnailImage: string;
  highResImage?: string;
  description: string;
  url: string;
  source: string;
}

export interface User {
  id: string;
  profilePicture: string;
  name: string;
}

export interface List {
  id?: string;
  title: string;
  users: User[];
  collection: Item[];
  creationDate: Date;
  updateDate: Date;
  visibility: string;
}
