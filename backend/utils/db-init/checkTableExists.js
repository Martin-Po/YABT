const checkTableExists = async (client, tableName) => {
  const res = await client.query(
    `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
    );`,
    [tableName]
  );
  return res.rows[0].exists;
};


module.exports = { checkTableExists };