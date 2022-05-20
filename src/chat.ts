
export interface IChat {
  key: string;
  author: string;
  message: string;
  element: HTMLElement;
  associatedElements?: HTMLElement[];
  other: {
    isCard : boolean;
    isOwner : boolean;
    isMember : boolean;
    isModer : boolean;
    amount : string;
    img_nums : number;
  };
}

