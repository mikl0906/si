// TypeScript types for SIQ content.xml file structure

export type SiqPackage = {
  name: string;
  info: Info;
  version: string;
  id: string;
  restriction: string;
  publisher: string;
  contactUri: string;
  difficulty: number;
  logo: string;
  date: string;
  language: string;
  hasQualityControl: boolean;
  tags: string[];
  rounds: Round[];
}

export type Info = {
  authors: string[];
  sources: string[];
  comment: string;
}

export type Round = {
  name: string;
  info: Info;
  type: RoundType;
  themes: Theme[];
}

export enum RoundType {
    Standard = 'standart',
    Table = 'table',
    Final = 'final',
    ThemeList = 'themeList',
}

export type Theme = {
  name: string;
  info: Info;
  questions: Question[];
}

export type Question = {
  info: Info;
  price: number;
  typeName: QuestionTypes;
  script: Step[];
  parameters: Record<string, StepParameter>;
  right: string[];
  wrong: string[];
}

export enum QuestionTypes {
  Default = '',
  Simple = 'simple',
  WithButton = 'withButton',
  Auction = 'auction',
  Stake = 'state',
  StakeAll = 'stakeAll',
  Cat = 'cat',
  Secret = 'secret',
  SecretPublicPrice = 'secretPublicPrice',
  SecretNoQuestion = 'secretNoQuestion',
  NoRisk = 'noRisk',
  ForYourself = 'forYourself',
  ForAll = 'forAll',
}

export type Step = {
  type: StepTypes;
  parameters: Record<string, StepParameter>;
}

export enum StepTypes {
  SetAnswerType = "setAnswerType",
  ShowContent = "showContent",
  AskAnswer = "askAnswer",
  SetAnswerer = "setAnswerer",
  AnnouncePrice = "announcePrice",
  SetPrice = "setPrice",
  SetTheme = "setTheme",
  Accept = "accept",
}

export type StepParameter = {
  type: StepParameterTypes;
  
}

export enum StepParameterTypes {
  Simple = "simple",
  Content = "content",
  Group = "group",
  NumberSet = "numberSet",
}