const mysql = require('mysql2')

const pool = mysql.createPool({
  host: '127.0.0.1',
  database: 'project1_01',
  user: 'root',
  password: 'admin123',
})

// 向外共享 db 数据库连接对象
module.exports = pool;