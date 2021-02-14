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
  users: User[];
  collection: Item[];
  creationDate: string;
  updateDate: string;
  visibility: string;
}
