import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

export const anagrafica = pgTable("anagrafica", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: text("nome").notNull().unique(),
});

export const certificato = pgTable("certificato", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  numero: text("numero").notNull(),
  oggetto: text("oggetto").notNull(),
  committente: text("committente").notNull(),
  impresa: text("impresa").references(() => anagrafica.nome),
  corpo: text("corpo").notNull(),
});

export const sal = pgTable("sal", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  numero: text("numero").notNull(),
  periodo: text("periodo"),
  imponibile: text("imponibile"),
  ritenuta: text("ritenuta"),
  iva: text("iva"),
  lordo: text("lordo"),
  quotaSospesa: text("quotaSospesa"),
  altro: text("altro"),
});
