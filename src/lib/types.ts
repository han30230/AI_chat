export interface Character {
  id: string;
  name: string;
  age: number;
  avatar: string;
  personality: string;
  tagline: string;
  /** 성향 (한 줄) */
  tendency?: string;
  /** 취향 (한 줄) */
  preferences?: string;
  /** 가슴 두근거리는 것 (한 줄) */
  turnOn?: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
