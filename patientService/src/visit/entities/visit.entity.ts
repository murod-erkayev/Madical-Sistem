import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Patient } from "../../patient/entities/patient.entity";
import { Note } from "../../note/entities/note.entity";

@Entity("visits")
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  patientId: number;

  @ManyToOne(() => Patient, (patient) => patient.visit) 
  @JoinColumn({ name: "patientId" }) 
  patient: Patient;

  @Column({ type: "timestamp" }) 
  visitDate: Date;

  @Column()
  reason: string;

  @OneToMany(() => Note, (note) => note.visit)
  note: Note[]; 

  @CreateDateColumn() 
  created_at: Date;
}
