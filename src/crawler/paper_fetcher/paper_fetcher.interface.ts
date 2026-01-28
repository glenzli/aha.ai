export interface HFUser {
  _id: string;
  avatarUrl?: string;
  isPro?: boolean;
  fullname?: string;
  user?: string;
  type?: string;
  isHf?: boolean;
  isHfAdmin?: boolean;
  isMod?: boolean;
  isUserFollowing?: boolean;
  followerCount?: number;
}

export interface HFAuthor {
  _id: string;
  user?: HFUser;
  name: string;
  status?: string;
  statusLastChangedAt?: string;
  hidden: boolean;
}

export interface HFOrganization {
  _id: string;
  name: string;
  fullname: string;
  avatar?: string;
}

export interface HFPaper {
  id: string;
  authors: HFAuthor[];
  publishedAt: string;
  submittedOnDailyAt?: string;
  title: string;
  submittedOnDailyBy?: HFUser;
  summary: string;
  upvotes?: number;
  discussionId?: string;
  githubRepo?: string;
  githubRepoAddedBy?: string;
  githubStars?: number;
  ai_summary?: string;
  ai_keywords?: string[];
  organization?: HFOrganization;
  mediaUrls?: string[];
  projectPage?: string;
}

export interface HFPaperResponse {
  paper: HFPaper;
  publishedAt: string;
  title: string;
  summary: string;
  thumbnail?: string;
  numComments?: number;
  submittedBy?: HFUser;
  organization?: HFOrganization;
  isAuthorParticipating?: boolean;
  mediaUrls?: string[];
}
