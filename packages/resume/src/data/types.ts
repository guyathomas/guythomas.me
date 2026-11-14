export interface Header {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
}

export interface Role {
  title: string;
  company: string;
  location?: string;
  date: string;
  achievements: string[];
}

export interface Back {
  about: string;
  colophon: string;
}

export interface Resume {
  header: Header;
  experience: Role[];
  back?: Back;
}
