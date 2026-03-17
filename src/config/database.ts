import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_NAME!,
  process.env.PG_USER!,
  process.env.PG_PASSWORD!,
  {
    host: process.env.PG_HOST!,
    port: parseInt(process.env.PG_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: false,
    },
  }
);

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};

export default sequelize;
