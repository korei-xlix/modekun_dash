export interface IChat {
  key: string;
  author: string;
  message: string;
  htmlcode: string;
  element: HTMLElement;
  associatedElements?: HTMLElement[];
}
