import { QueryRunner, Table } from 'typeorm';
import { MigrationInterface } from 'typeorm';
export class CreateVisitTable1690000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner):Promise<void>{
    await queryRunner.createTable(
      new Table({
        name: "visits",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "patientId",
            type: "int",
          },
          {
            name: "visitDate",
            type: "timestamp",
          },
          {
            name: "reason",
            type: "varchar",
          },
          {
            name: "create_at",
            type: "varchar",
          },
        ],
      }),
      true
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("visits")
  }
}