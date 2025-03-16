import { Sequelize } from 'sequelize'
import pg from 'pg'
import 'dotenv/config'
import mysql from 'mysql2'

const URLBASEDEDATOS =
  process.env.POSTGRES_DOCKER === 'POSTGRES'
    ? process.env.URL_BASEDEDATOS_POSTGRES
    : process.env.URL_BASEDEDATOS_DOCKER

export const basedatos = new Sequelize(`${URLBASEDEDATOS}`, {
  dialectModule: pg,
  dialect: 'postgres'
})
