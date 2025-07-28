import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDoctorTable1690000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "doctors",
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
            name: "email",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "phoneNumber",
            type: "varchar",
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "specialization",
            type: "varchar",
          },
          {
            name: "experience",
            type: "varchar",
          },
          {
            name: "role",
            type: "varchar",
            default: "admin",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("doctors");
  }
}
