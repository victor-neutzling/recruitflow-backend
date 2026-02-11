import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import "dotenv/config";

const connectionString = `${process.env["DATABASE_URL"]}`;

console.log(connectionString);

const adapter = new PrismaPg({ connectionString });
export default new PrismaClient({ adapter });
