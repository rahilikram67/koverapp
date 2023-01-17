/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
import { SecurePassword } from "blitz"
import db from "./index"

const createAdminUser = async () => {
  const email = process.env.DB_SEED_ADMIN_EMAIL || "admin@example.com"
  const password = process.env.DB_SEED_ADMIN_PASSWORD || "admin123"

  const hashedPassword = await SecurePassword.hash(password.trim())

  const user = await db.user.create({
    data: { email: email.toLowerCase().trim(), hashedPassword, role: "USER" },
    select: { id: true, name: true, email: true, role: true },
  })

  console.log("Admin Account Created!")
  console.log("Email: ", email)
  console.log("Password: ", password)

  return user
}

const seed = async () => {
  await createAdminUser()
}

export default seed
