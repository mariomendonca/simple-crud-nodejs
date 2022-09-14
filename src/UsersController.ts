import { Request, Response } from "express";
import { prisma } from "./prisma";
import bcrypt from 'bcrypt'

export class UsersController {
  async handleCreate(req: Request, res: Response): Promise<Response> {
    const {
      name,
      password,
      email
    } = req.body
    const hashedPassword = await bcrypt.hashSync(password, 8)
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      })
      return res.status(201).json({ user })
    } catch {
      return res.sendStatus(400)
    }
  }

  async handleLogin(req: Request, res: Response): Promise<Response> {
    const {
      email,
      password
    } = req.body

    try {
      const user = await prisma.user.findFirst({
        where: {
          email
        }
      })

      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password)

      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      return res.status(200).json(user)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
      return res.status(400).json({ message: 'Unexpected error' })
    }
  }

  async handleGetById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    try {
      const user = await prisma.user.findFirst({
        where: {
          id
        }
      })

      return res.status(200).json(user)
    } catch (error) {
      return res.sendStatus(400)
    }
  }
}
