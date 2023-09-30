
export interface IMdText {
  id: string;
  text: string;
  title: string;
  mode: 'edit' | 'preview' ;
  isChanged: boolean;
}
