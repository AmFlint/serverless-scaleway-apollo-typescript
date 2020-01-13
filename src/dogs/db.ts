import * as mysql from 'promise-mysql';

// ---- MySQL Setup ---- //
const createConnection = () => {
  return mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
  });
}

const executeQuery = async (query: string) => {
  const connection = await createConnection();
  const results = await connection.query(query);
  connection.end();
  return results;
}

// --- Repositories ---- //

// -- Dogs -- //
export const listDogs = async () => {
  const query = 'SELECT * from dogs';
  try {
    return await executeQuery(query);
  } catch (error) {
    console.error(error);
    throw new Error('unable to access database');
  }
}

export const getDog = async (id: number) => {
  const query = 'SELECT * FROM dogs WHERE id = ' + id;
  try {
    const results = await executeQuery(query)
    if (!results.length) {
      return null;
    }
    return results[0];
  } catch (error) {
    console.error(error);
    throw new Error('unable to access database');
  }
}

export const getDogsForOwner = async (ownerId: number) => {
  const query = `SELECT * FROM dogs WHERE owner_id = ${ownerId}`;
  return await executeQuery(query);
}

export const createDog = async (name: string, ownerId: number) => {
  const createQuery = `INSERT INTO dogs (name, owner_id) VALUES(?, ?)`;
  const params = [name, ownerId]
  const formattedQuery = mysql.format(createQuery, params);

  await executeQuery(formattedQuery);

  // get last created id
  const insertedIdQuery = `SELECT id from dogs where owner_id = ? ORDER BY id DESC LIMIT 1`;
  const insertedIdQueryParams = [ownerId];
  const formattedIdQuery = mysql.format(insertedIdQuery, insertedIdQueryParams);
  const result = await executeQuery(formattedIdQuery);
  const dog = {
    name,
    owner_id: ownerId,
    id: result[0].id
  };
  return dog;
}

export const deleteDog = async (id: number) => {
  const query = `DELETE FROM dogs WHERE id = ${id}`;
  await executeQuery(query);
}

// -- Owners -- //

export const listOwners = async () => {
  const query = 'SELECT * FROM owners';
  return await executeQuery(query);
}

export const getOwner = async (id: number) => {
  const query = 'SELECT * from owners where id = ' + id;
  const results = await executeQuery(query);
  if (!results.length) {
    return null;
  }
  return results[0];
}