import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Independent tables first (no FK dependencies on new tables)

  await db.schema
    .createTable('genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable('authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('bio', 'varchar(255)')
    .execute();

  // Dependent on existing `users` table
  await db.schema
    .createTable('borrowers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.notNull().unique().references('users.id').onDelete('cascade')
    )
    .addColumn('membership_number', 'varchar(255)', (col) =>
      col.notNull().unique()
    )
    .addColumn('phone', 'varchar(255)')
    .addColumn('status', 'varchar(255)', (col) =>
      col.defaultTo('active').notNull()
    )
    .execute();

  // Dependent on `genres`
  await db.schema
    .createTable('books')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('isbn', 'varchar(255)', (col) => col.unique())
    .addColumn('genre_id', 'integer', (col) =>
      col.notNull().references('genres.id').onDelete('restrict')
    )
    .addColumn('published_year', 'integer')
    .execute();

  // Join table: dependent on `books` and `authors`
  await db.schema
    .createTable('book_authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('cascade')
    )
    .addColumn('author_id', 'integer', (col) =>
      col.notNull().references('authors.id').onDelete('cascade')
    )
    .execute();

  // Dependent on `borrowers` and `books`
  await db.schema
    .createTable('loans')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('borrower_id', 'integer', (col) =>
      col.notNull().references('borrowers.id').onDelete('cascade')
    )
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('restrict')
    )
    .addColumn('loan_date', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('due_date', 'timestamp', (col) => col.notNull())
    .addColumn('returned_date', 'timestamp')
    .addColumn('status', 'varchar(255)', (col) =>
      col.defaultTo('active').notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Reverse dependency order — only tables created in this migration
  await db.schema.dropTable('loans').ifExists().execute();
  await db.schema.dropTable('book_authors').ifExists().execute();
  await db.schema.dropTable('books').ifExists().execute();
  await db.schema.dropTable('borrowers').ifExists().execute();
  await db.schema.dropTable('authors').ifExists().execute();
  await db.schema.dropTable('genres').ifExists().execute();
}
