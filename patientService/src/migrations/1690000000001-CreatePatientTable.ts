import { QueryRunner, Table } from "typeorm";
import { MigrationInterface } from "typeorm";

export class CreatePatientTable1690000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "patients",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "fullName",
            type: "varchar",
          },
          {
            name: "phoneNumber",
            type: "varchar",
          },
          {
            name: "email",
            type: "varchar",
          },
          {
            name: "address",
            type: "varchar",
          },
          {
            name: "bloodGroup",
            type: "varchar",
          },
          {
            name: "bio",
            type: "varchar",
          },
          {
            name: "isActive",
            type: "boolean",
          },
          {
            name: "doctorId",
            type: "int",
          },
        ],
      }),
      true
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("patients");
  }
}
