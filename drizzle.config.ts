import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/main/database/schema/*",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./caduceus.db"
  }
});
