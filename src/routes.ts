import { Router } from "express";
import { UsersController } from "./UsersController";

const usersController = new UsersController()

export const router = Router()

router.post('/users', usersController.handleCreate)
router.post('/users/login', usersController.handleLogin)