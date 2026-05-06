export type LeaderRole = 'founder' | 'captain' | 'vice' | 'other';

export interface Leader {
  id: string;
  name: string;
  title: string;
  term: string;
  image: string;
  bio: string;
  cardX?: string;
  modalY?: string;
  role: LeaderRole;
}

export interface Member {
  name: string;
  image: string;
}

export interface Generation {
  term: string;
  year: string;
  members: Member[];
  isCollecting?: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
