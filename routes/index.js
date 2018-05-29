const express = require('express')
let router = express.Router()
const mysql = require('mysql2/promise')
const pool = mysql.createPool({
  host: 'localhost',
  user: 'CielChan',
  password: 'Byebye171122',
  database: 'oxlxs'
})

/* GET home page. */

router.get('/home', (req, res) => {
  res.render('home', {title: 'Oxlxs'})
})

router.get('/home/join', (req, res) => {
  res.render('join', {title: 'Jion Oxlxs'})
})
router.post('/SuccessJoin', function (req, res, next) {
  const name = req.body.name
  const birth = req.body.birth
  const age = req.body.age
  const tel = req.body.tel
  const height = req.body.height
  const city = req.body.city
  const company_name = req.body.company_name
  let connect
  pool.getConnection().then(function (con) {
    connect = con
    return con.beginTransaction()
  }).then(function (con) {
    return connect.query('select get_id(?) as id', [company_name])
  }).then(function ([company_id]) {
    console.log(company_id)
    return connect.query('insert into competitor(name,birth,tel,height,city,company_id) ' +
      'value (?,?,?,?,?,?)', [name, birth, tel, height, city, company_id[0].id])
  }).then(function () {
    connect.commit()
    res.json({success: true, message: '恭喜您，已成功报名'})
  }).catch(function (e) {
    res.json({success: false, message: '对不起，报名失败，请重试', error: e.stack})
    connect.rollback()
  }).then(function () {
    connect.release()
  })
})

router.get('/home/company', (req, res) => {
  res.render('company',{title:"oxlxs"})
})
router.post('/JoinCompany', function (req, res, next) {
  const number = req.body.number
  const position = req.body.position
  const ranking = req.body.ranking
  let connect
  pool.getConnection().then(function (con) {
    connect = con
    return con.beginTransaction()
  }).then(function () {
    return connect.query('insert into performance(number,position,ranking) values (?,?,?)', [number, position, ranking])
  }).then(function () {
    connect.commit()
    res.json({success: true, message: '选手表现修改成功'})
  }).catch(function (e) {
    console.log(e.stack)
    res.json({success: false, message: '请核实该选手是否存在'})
    connect.rollback()
  }).then(function () {
    connect.release()
  })
})
router.get('/home/find', (req, res) => {
  res.render('find', {title: 'Oxlxs'})
})
router.post('/findCompetitor', async function (req, res, next) {
  try {
    const [result] = await pool.query('select * from competitor_inform')
    res.json({result, success: true})
  } catch (e) {
    console.error(e)
    res.json({success: false, error: e.stack})
  }
})

router.post('/findCompany', async function (req, res, next) {
  try {
    const [name, _] = await pool.query('select company_name from company')
    console.log(name)
    res.json({name: name, success: true})
  } catch (e) {
    res.json({success: false, error: e.stack || e})
  }
})
router.post('/findmore', async function (req, res, next) {
  const name = req.body.name
  try {
    const [result] = await pool.query('select * from competitor_lis where name=?', [name])
    console.log(result)
    if (result.length === 0)
      res.json({success: false, message: '请核对后再查询'})
    else
      res.json({success: true, result})
  } catch (e) {
    console.log(e.stack)
  }

})

router.get('/home/poll', (req, res) => {
  res.render('poll', {title: '投票直通道'})
})

router.post('/number', async function (req, res, next) {
  const [result, _] = await pool.query('select number,name from competitor')
  res.json({result, success: true})
})
router.post('/poll', async function (req, res, next) {
  try {
    pool.query('update competitor set poll=poll+60 where number=?', [req.body.number])
    res.json({success: true, message: '恭喜你，已成功投票 '})
  } catch (e) {
    res.json({success: false, message: '请核对编号再进行投票'})
  }
})

router.get('/home/out', (req, res) => {
  res.render('out')
})
router.post('/getpoll', async function (req, res, next) {
  try {
    const [result] = await pool.query('select number,name,poll,company_name from competitor_inform')
    res.json({message: result})
  } catch (e) {
    console.log(e)
  }
})
router.post('/out', function (req, res, next) {
  const company_name = req.body.company_name
  let connect
  pool.getConnection().then(function (con) {
    connect = con
    return con.beginTransaction()
  }).then(function (con) {
    return connect.query('delete from competitor where poll<100 and company_id=(select get_id(?))', [company_name])
  }).then(function () {
    return connect.query('delete from company where company_name=?', [company_name])
  }).then(function () {
    connect.commit()
    res.json({success: true, message: '删除成功'})
  }).catch(function (e) {
    console.log(e.stack)
    res.json({success: false, message: '该公司不可被删除'})
    connect.rollback()
  }).then(function () {
    connect.release()
  })
})

// router.all('/', async function (req, res, next) {
//   console.log(req.body)
//
//   const tel = req.body.tel || req.params.tel || '11'
//
//   try {
//     const [rows, _] = await pool.query('insert into company(name,tel,address,manager) value(?,?,?,?)'
//       , [req.body.name, req.body.tel, req.body.addr, req.body.manager])
//     setTimeout(function () {
//       res.json({success:true})
//     }, 2000)
//   } catch (e) {
//     console.log(e)
//     res.json({success:false, error: e.stack})
//   }
// })
//
// router.get('/home', (req, res) => {
//   res.render('index', {title: 'title'})
// })

// router.get('/', async function (req, res, next) {
//   console.log(req.query)
//   const name = req.query.name
//   const math = req.query.math
//   let connect
//   pool.getConnection().then(function (conn) {
//     connect=conn.beginTransaction()
//     return conn
//   }).then(async function (conn) {
//     return {conn, rows:(await conn.query('update student set math = math+100'))[0]}
//   }).then(function ({conn,rows}) {
//     res.render('index', {title: rows.affectedRows})
//     return conn
//   }).then(function (conn) {
//     conn.rollback()
//     conn.release()
//   }).catch(function (err) {
//
//   })

// if(!Number.isInteger(Number(math)))
//   return res.send('bushigez<br>hengshu')
// try {
//   const [rows,_]=await pool.query('insert into student (name,math) values (?,?)',[req.query.name,req.query.math])
//   res.send('hello')
//   console.log(rows)
// }catch (e) {
//   res.send('Bye')
//   console.log(e)
// }
// try {
//   // const [rows, _] = await pool.query('select ? + ? as res', [1])
//   const [rows, _] = await pool.query('show tables ')
//   console.log(rows)
// } catch (e) {
//   console.log(e)
//}
// res.end()
//})
module.exports = router