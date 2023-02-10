import { DataSource } from "typeorm";

const connectDB = new DataSource({
  type: "mysql",
  host: process.env.DATABASE_URI,
  port: 3306,
  logging: false,
  username: "root",
  password: "password",
  database: "test_node",
  synchronize: true,
  entities: ["./src/entity/**/*.ts"],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

connectDB
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized`);
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err);
  });

export default connectDB;
