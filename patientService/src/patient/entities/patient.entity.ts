import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Visit } from '../../visit/entities/visit.entity';
@Entity("patients")
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  fullName: string;
  @Column()
  phoneNumber: string;
  @Column()
  email: string;
  @Column()
  address: string;
  @Column()
  bloodGroup: string;
  @Column()
  bio: string;
  @Column()
  isActive: boolean;
  @Column()
  doctorId: number;
  @OneToMany(() => Visit, (visit) => visit.patient)
  visit: Visit;
}
