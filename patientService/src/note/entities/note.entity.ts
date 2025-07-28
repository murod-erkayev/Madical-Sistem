import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Visit } from "../../visit/entities/visit.entity";
@Entity("notes")
export class Note {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: string;
  @CreateDateColumn()
  createAt: string;
  @Column()
  visitId: number;

  @ManyToOne(() => Visit, (visit) => visit.note)
  @JoinColumn({ name: "visitId" }) 
  visit: Visit;
}
