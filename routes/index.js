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

router.get('/home',(req,res)=>{
  res.render('home',{title:"Oxlxs"})
})

router.get('/home/join',(req,res)=>{
  res.render('join',{title:'Oxlxs'})
})

router.post('/SuccessJoin',async function  (req,res,next) {
  const name=req.body.name
  const birth=req.body.birth
  const age=req.body.age
  const tel=req.body.tel
  const height=req.body.height
  const city=req.body.city
  const company=req.body.company
  try{
    const [rows,_]=await pool.query('insert into competitor(name,birth,age,tel,height,city,company) ' +
      'value (?,?,?,?,?,?,?)',[name,birth,age,tel,height,city,company])
    res.json({success:true,message:"您已成功报名"})
  }catch(e){
    res.json({success:false,message:"对不起，报名失败，请刷新界面重试 "+e.stack})
  }
})

router.get('/home/find',(req,res)=>{
  res.render('find',{title:"Oxlxs"})
})

router.post('/findCompetitor',async function  (req,res,next) {
  try{
    const [number,_]=await pool.query('select number from competitor order by number')
    const [name,__]=await pool.query('select name from competitor order by number')
    const [height,___]=await pool.query('select height from competitor order by number')
    const [birth,____]=await pool.query('select birth from competitor order by number')
    const [city,_____]=await pool.query('select city from competitor order by number')
    const [company,______]=await pool.query('select company from competitor order by number')
    res.json({number:number,name:name,height:height,birth:birth,city:city,company:company,success:true})
  }catch(e){
    res.json({success:false,error:e.stack})
  }
})

router.post('/findCompany',async function  (req,res,next) {
  try{
    const [name,_]=await pool.query('select name from company where name!=""')
    res.json({name:name,success:true})
  }catch(e){
    res.json({success:false})
  }
})


router.get('/home/poll',(req,res)=>{
  res.render('poll',{title:"投票直通道"})
})

router.post('/number',async function  (req,res,next) {
  const[number,_]=await pool.query('select number from competitor order by number')
  const[name,__]=await pool.query('select name from competitor order by number')
  res.json({number:number,name:name,success:true})
})
router.post('/poll',async function  (req,res,next) {
  console.log(req.body.number)
  try{
    pool.query('update performance set poll=poll+1 where number=?',[req.body.number])
    res.json({success:true,message:"恭喜你，已成功投票"})
  }catch (e) {
    res.json({success:false,message:"请核对编号再进行投票"})
  }
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
