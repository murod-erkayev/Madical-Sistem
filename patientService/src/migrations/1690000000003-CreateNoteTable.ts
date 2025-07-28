import { text } from "stream/consumers";
import { QueryRunner, Table } from "typeorm";
import { MigrationInterface } from "typeorm";
export class CreateNoteTable1690000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "notes",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "text",
            type: "varchar",
          },
          {
            name: "visitId",
            type: "int",
          },
          {
            name: "createAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
   await  queryRunner.dropTable("notes");
  }
}
