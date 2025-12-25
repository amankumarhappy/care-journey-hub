import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'patient' | 'doctor' | 'admin' | 'delivery';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  specialization?: string; // for doctors
  registrationNumber?: string; // for doctors
  approved?: boolean; // for doctors
  language: 'en' | 'hi';
  subscriptionStatus: 'free' | 'paid';
  coins: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  specialization?: string;
  registrationNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: Record<string, User & { password: string }> = {
  'admin@mediokart.com': {
    id: '1',
    email: 'admin@mediokart.com',
    password: '123456',
    name: 'Admin User',
    role: 'admin',
    language: 'en',
    subscriptionStatus: 'paid',
    coins: 0,
  },
  'doctor@mediokart.com': {
    id: '2',
    email: 'doctor@mediokart.com',
    password: '123456',
    name: 'Dr. Sharma',
    role: 'doctor',
    specialization: 'General Medicine',
    registrationNumber: 'MH12345',
    approved: true,
    language: 'en',
    subscriptionStatus: 'paid',
    coins: 0,
  },
  'patient@mediokart.com': {
    id: '3',
    email: 'patient@mediokart.com',
    password: '123456',
    name: 'Rahul Kumar',
    role: 'patient',
    phone: '+91 9876543210',
    language: 'en',
    subscriptionStatus: 'free',
    coins: 150,
  },
  'delivery@mediokart.com': {
    id: '4',
    email: 'delivery@mediokart.com',
    password: '123456',
    name: 'Delivery Partner',
    role: 'delivery',
    phone: '+91 9876543211',
    language: 'en',
    subscriptionStatus: 'free',
    coins: 0,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('mediokart_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password && mockUser.role === role) {
      const { password: _, ...userData } = mockUser;
      setUser(userData);
      localStorage.setItem('mediokart_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      specialization: data.specialization,
      registrationNumber: data.registrationNumber,
      approved: data.role !== 'doctor',
      language: 'en',
      subscriptionStatus: 'free',
      coins: 0,
    };
    setUser(newUser);
    localStorage.setItem('mediokart_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mediokart_user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('mediokart_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
