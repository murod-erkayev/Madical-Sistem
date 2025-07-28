import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("doctors")
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  fullName: string;
  @Column({ nullable: true })
  phoneNumber: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  specialization: string;
  @Column()
  experience: string;
  @Column({ default: "doctor" })
  role: string;
  @Column({ default: true })
  isActive: boolean;
  @Column({ nullable: true })
  hashedRefreshToken?: string;
}
