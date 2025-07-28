import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
@Entity("admins")
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  fullName: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column()
  isActive: boolean;
  @Column({ default: "admin" })
  role: string;
  @Column({ nullable: true })
  hashedRefreshToken: string;
}
