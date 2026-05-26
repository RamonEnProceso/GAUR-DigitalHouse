export interface User {
  id: string;
  userId: string;
  nombre: string;
  edad: number;
  cumpleaños: string;
  fechaDeCreacion: string;
  altura: number;
  medidas: string;
  pesoActual: number;
  descripcion: string;
  futuroIdeal: string;
}

export interface UserCreatePayload {
  nombre: string;
  edad: number;
  cumpleaños: string;
  altura: number;
  medidas: string;
  pesoActual: number;
  descripcion: string;
  futuroIdeal: string;
}

export interface UserUpdatePayload {
  nombre?: string;
  edad?: number;
  cumpleaños?: string;
  altura?: number;
  medidas?: string;
  pesoActual?: number;
  descripcion?: string;
  futuroIdeal?: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    userId: 'user-123',
    nombre: 'Ramón',
    edad: 22,
    cumpleaños: '2003-09-01',
    fechaDeCreacion: '2026-05-26T00:00:00.000Z',
    altura: 1.75,
    medidas: '100-80-95',
    pesoActual: 94,
    descripcion: 'Desarrollador apasionado por la tecnología y el fitness.',
    futuroIdeal: 'Ser un profesional versátil en desarrollo full-stack y mantener un estilo de vida saludable.'
  },
  {
    id: '2',
    userId: 'user-123',
    nombre: 'Ana García',
    edad: 28,
    cumpleaños: '1998-01-12',
    fechaDeCreacion: '2026-05-26T08:30:00.000Z',
    altura: 1.68,
    medidas: '90-70-95',
    pesoActual: 62,
    descripcion: 'Profesional creativa con pasión por el diseño y la tecnología.',
    futuroIdeal: 'Vivir en el campo, tener un estudio propio y trabajar en proyectos sostenibles.'
  },
  {
    id: '3',
    userId: 'user-123',
    nombre: 'Carlos Rojas',
    edad: 35,
    cumpleaños: '1989-09-03',
    fechaDeCreacion: '2026-05-26T08:35:00.000Z',
    altura: 1.82,
    medidas: '100-82-100',
    pesoActual: 78,
    descripcion: 'Emprendedor con enfoque en la educación digital y el crecimiento personal.',
    futuroIdeal: 'Crear una plataforma educativa con impacto global y ayudar a nuevos líderes.'
  }
];

export default class UserModel {
  private users: User[] = [...mockUsers];

  async getAllByUserId(userId: string): Promise<User[]> {
    return this.users.filter((user) => user.userId === userId);
  }

  async getById(userId: string, id: string): Promise<User | undefined> {
    return this.users.find((user) => user.userId === userId && user.id === id);
  }

  async create(userId: string, payload: UserCreatePayload): Promise<User> {
    const newUser: User = {
      id: String(this.users.length + 1),
      userId,
      fechaDeCreacion: new Date().toISOString(),
      ...payload
    };

    this.users.push(newUser);
    return newUser;
  }

  async update(userId: string, id: string, payload: UserUpdatePayload): Promise<User | undefined> {
    const index = this.users.findIndex((user) => user.userId === userId && user.id === id);
    if (index === -1) {
      return undefined;
    }

    const updatedUser = {
      ...this.users[index],
      ...payload
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const index = this.users.findIndex((user) => user.userId === userId && user.id === id);
    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);
    return true;
  }
}
