export interface Character {
  id: string;
  name: string;
  age: number;
  avatar: string;
  personality: string;
  tagline: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
