
var mysql = require("mysql");
var express = require('express');
var app = express();

var session = require('express-session');
app.use(session({secret: 'ssshhhhh'}));
var sess;

const crypto = require('crypto');
const secret = 'abcdefg';

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

var bodyParser = require('body-parser')
var url = bodyParser.urlencoded({ extended: false })

var connection = mysql.createConnection
(
    {
        host: "localhost",
        port: 8889,
        database: "Ecommerce",
        user: "root",
        password: "root",
    }
);

app.get('/encrypt', function(req, res)
{
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret)
    .update('test')
    .digest('hex');

    console.log(hash);

    res.end();
})


/////////////////////////////////////////////////////  USER  /////////////////////////////////////////////////
app.get('/userlogin', function(req, res)
{
	res.render('userlogin', 
    {
        notif:''
    });
})

app.get('/userregister', function(req, res)
{
    res.render('userregister', 
    {

    });
})

app.post('/userregister', url, function(req, res)
{
    //console.log(req.body);
    
    var sql = 'SELECT * FROM UserLogin WHERE Username = ?';
    connection.query(sql, [req.body.Username], function (err, rows) {
        
        if (rows.length > 0)
        {
            res.render('userregister', 
            {
                notif:'Username sudah terdaftar !'
            });
        }
        else
        {
        
            const Password = crypto.createHmac('sha256', secret)
            .update(req.body.password)
            .digest('hex');

            //console.log(password);

            connection.query("insert into UserLogin set ? ",
            {
                Username : req.body.Username,
                Password : Password,
            });

            connection.query("insert into UserData set ? ",
            {
                Name : req.body.Name,
                Email : req.body.Email,
                Phone : req.body.Phone,
            });

            res.render('userregister', {notif:''});
        }
    });
})

//////////////////////////////////////////  USER LOGIN  //////////////////////////////////////////////////////////

app.post('/userlogin', url, function(req, res)
{
    const password = crypto.createHmac('sha256', secret)
    .update('test')
    .digest('hex');


    var sql = 'SELECT * FROM AdminLogin WHERE Username = ? and Password = ?';
    connection.query(sql, [req.body.Username, req.body.Password], function (err, rows) {
    if (err) throw err;
    console.log(rows[0].userid);

        if (rows.length > 0)
        { 
            sess=req.session;
            sess.userid = rows[0].Id_User;
            sess.username = rows[0].Username;

            res.redirect('/');
        }
        else
        {
            res.render('user', 
            {
                notif:'Username atau Password salah !'
            });
        }
    });
})


app.get('/', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        connection.query("select * from Season",function(err,rows,field){
            if (err) throw err;
            res.render('homepage',{data : rows, username : ""});
        })
    }
    else
    {
        connection.query("select * from Season",function(err,rows,field){
            if (err) throw err;
            res.render('homepage',{data : rows, username : sess.username})
        });
    }
})


app.get('/category/:Id_Season', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {   
    var sql="select * from Category where Id_Season = ?"
    connection.query(sql,[req.params.Id_Season], function(err,rows,field)
    {
    var sql2="select * from Season where Id_Season = ?"
    connection.query(sql2,[req.params.Id_Season],function(err2,rows2)
    {

                res.render("allseason", 
            {
                data: rows,
                data2: rows2,
                username : ""
            });
        })
    })
    }
    else
    {
    
    var sql="select * from Category where Id_Season = ?"
    connection.query(sql,[req.params.Id_Season], function(err,rows,field)
    {
    var sql2="select * from Season where Id_Season = ?"
    connection.query(sql2,[req.params.Id_Season],function(err2,rows2)
    {
    
                    res.render("allseason", 
                {
                    data: rows,
                    data2: rows2,
                    username : sess.Username
                });
            })
        
    })
}})



app.get('/product/:Id_Category',function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {   
    var sql="select * from Product where Id_Category = ?"
    connection.query(sql,[req.params.Id_Category], function(err,rows,field)
    {
    var sql2="select * from Category inner join Season on Category.Id_Season=Season.Id_Season where Id_Category = ?"
    connection.query(sql2,[req.params.Id_Category],function(err2,rows2)
    {

                res.render("product", 
            {
                data: rows,
                data2: rows2,
                username : ""
            });
        })
    })
    }
    else
    {
    
    var sql="select * from Product_Name where Id_Category = ?"
    connection.query(sql,[req.params.Id_Season], function(err,rows,field)
    {
    var sql2="select * from Category inner join Season on Category.Id_Season=Season.Id_Season where Id_Category = ?"
    connection.query(sql2,[req.params.Id_Season],function(err2,rows2)
    {
    
                    res.render("product", 
                {
                    data: rows,
                    data2: rows2,
                    username : sess.Username
                });
            })
        
    })
}})



var tempiduserdetail="";
app.get('/productdetail/:Id_Product', function(req,res)
{
    sess = req.session;
    tempiddetail=req.params.Id_Product;
    if (sess.userid==null)
    {   
    var sql="select * from Product where Id_Product = ?"
    connection.query(sql,[req.params.id], function(err,rows,field)
        {
        var sql2="select * from ProductSize inner join ProductColor on ProductSize.Id_ProductColor=ProductColor.Id_ProductColor where Id_Product = ?"
        connection.query(sql2,[req.params.id],function(err2,rows2)
        {
            // console.log(rows)
            // res.json(rows2)
        res.render("productdetail", 
            {
            data : rows,
            data2 : rows2,
            username : ""
            })
        })
        
    })
    }
    else
    {
    var sql="select * from Product where Id_Product = ?"
    connection.query(sql,[req.params.Id_Product], function(err,rows,field)
        {
        var sql2="select * from ProductSize inner join ProductColor on ProductSize.Id_ProductColor=ProductColor.Id_ProductColor where Id_Product = ?"
        connection.query(sql2,[req.params.Id_Product],function(err2,rows2)
        {
            // console.log(rows)
            // res.json(rows2)
        res.render("productdetail", 
            {
            data : rows,
            data2 : rows2,
            username : sess.Username
            })
        })
        
})
}})


///////////////////////////////////////////////////////  USER REACT  //////////////////////////////////////////////////

app.get('/', function (req, res)
{
    var sql = 'SELECT * from Season';
    connection.query(sql, function (err, rows)
    {
        res.json(rows);
    });
})


app.get('/category/:id', function(req,res)
{
    var sql = "SELECT * from Category where Id_Season=?"
    connection.query(sql,[req,params.id], function (err, rows)
    {
        res.json(rows);
    })
})


app.get('/product', function(req, res)
{
    var sql = "SELECT * from Product=?"
    connection.query(sql, function (err, rows)
    {
        res.json(rows);
    })   
})


app.get('/productdetail', function(req, res)
{
    var sql = "SELECT * from Product join ProductColor on Product.Id_Product=ProductColor.Id_Product join ProductSize on ProductColor.Id_ProductColor=ProductSize.Id_ProductColor"
    connection.query(sql, function (err, rows)
    {
        res.json(rows);
    });   
})





/////////////////////////////////////////////////////////  ADMIN  /////////////////////////////////////////////////

app.get('/encrypt', function(req, res)
{
    const secret = 'abcdefg';
    const hash = crypto.createHmac('sha256', secret)
    .update('test')
    .digest('hex');

    console.log(hash);

    res.end();
})

app.get('/admin', function(req, res)
{
	res.render(__dirname+'/views/formlogin', 
    {
        notif:''
    });
})

app.get('/formregister', function(req, res)
{
    res.render('formregister', 
    {

    });
})

app.post('/register', url, function(req, res)
{
    //console.log(req.body);
    
    var sql = 'SELECT * FROM AdminLogin WHERE Username = ?';
    connection.query(sql, [req.body.Username], function (err, rows) {

        if (rows.length > 0)
        {
            res.render(__dirname+'/views/formlogin', 
            {
                notif:'Username sudah terdaftar !'
            });
        }
        else
        {
            const password = crypto.createHmac('sha256', secret)
            .update(req.body.password)
            .digest('hex');

            //console.log(password);

            connection.query("insert into AdminLogin set ? ",
            {
                Username : req.body.Username,
                Password : password,
            });

            connection.query("insert into AdminData set ? ",
            {
                Name : req.body.name,
                Email : req.body.email,
            });

            res.redirect('/admindata');
        }
    });
})

//////////////////////////////////////////////////  Admin Login  //////////////////////////////////////////////////////////
app.get('/formlogin', function(req, res)
{
    res.render('formlogin', 
    {
        notif:''
    });
})

app.post('/login', url, function(req, res)
{
    var sql = 'SELECT * FROM AdminLogin WHERE Username = ? and Password = ?';
    connection.query(sql, [req.body.Username, req.body.Password], function (err, rows) {
    if (err) throw err;
    console.log(rows[0].userid);

        if (rows.length > 0)
        { 
            sess=req.session;
            sess.userid = rows[0].Id_Admin;
            sess.Username = rows[0].Username;

            res.redirect('/adminseason');
        }
        else
        {
            res.render(__dirname+'/views/formlogin', 
            {
                notif:'Username atau Password salah !'
            });
        }
    });
})

//////////////////////////////////////////////////////////  Admin Logout  /////////////////////////////////////////////////////
app.get('/logout',function(req,res)
{
    req.session.destroy(function(err) 
    {
        if(err) 
        {
            console.log(err);
        } 
        else {
            res.redirect('/admin');
        }
    });
});


//////////////////////////////////////////////////  Admin Season  /////////////////////////////////////////////////////////
app.get('/adminseason', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from Season",function(err,rows,field){
            if (err) throw err;
    
            res.render(__dirname+'/views/adminseason', 
            {
                data : rows,
                username : sess.Username
            });
        });
    }
})

////////////////////////////////////////////////////////  Admin Insert Season ////////////////////////////////////////////
app.get('/forminsert', function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/');
    }
    else
    {
        res.render(__dirname+'/views/forminsert', 
        {
            username : sess.Username
        });
    }
})

app.post('/insertdata', url, function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/');
    }
    else
    {
        connection.query("insert into Season set ? ",
        {
            Season_Name : req.body.name,
        });
    
        res.redirect('/adminseason');
    }
})


///////////////////////////////////////////////////  Admin Delete Season  /////////////////////////////////////////////////
app.get('/deletedata/:id', function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/');
    }
    else
    {
        connection.query("delete from Season where ? ",
        {
            Id_Season : req.params.id,
        });

        res.redirect('/adminseason');
    }
	
})

//////////////////////////////////////////////////  Admin Edit Season  /////////////////////////////////////////////////////
app.get('/formedit/:id', function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/');
    }
    else
    {
        res.render('formedit', 
        {
            id :req.params.id,
            username : sess.Username,
        });
    }
})


app.post('/editdata/:id', url, function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/');
    }
    else
    {
        connection.query("update Season set ? where ? ",
        [
            {
                Season_Name : req.body.name,
            },
            {
                Id_Season : req.params.id,
            }
        ]);

        res.redirect('/adminseason');
    }
	
})


//////////////////////////////////////  Admin Category  //////////////////////////////////////////////
var tempidpro="";
app.get('/admincategory/:id', function(req, res)
{
    sess = req.session;
    tempidpro=req.params.id;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {   
        var sql="select * from Category where Id_Season = ?"
        connection.query(sql,[req.params.id], function(err,rows,field)
        {
        var sql2="select * from Season where Id_Season = ?"
        connection.query(sql2,[req.params.id],function(err2,rows2)
        {
            console.log(rows2)

            res.render("admincategory", 
            {
                data: rows,
                data2: rows2,
                username : sess.Username
            });
        })
        })
    }
})


////////////////////////////////////  Admin Insert Category  ///////////////////////////////////////////////////////////

app.get('/admininsertcategory/:id', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from Season where Id_Season = ?",[req.params.id],function(err,rows){
            console.log(rows)
        
        res.render("admininsertcategory",
        {
            data: rows,
            username : sess.Username
        
        });
    })
    }
})

app.post('/admininsertcategory', url, function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("insert into Category set ? ",
        {
            Category_Name : req.body.category,
            Id_Season : req.body.seasonid
        });
    
        res.redirect(`/admincategory/${tempidpro}`);
    }
})

////////////////////////////////////  Admin Delete Category  ///////////////////////////////////////////////////////

app.get('/admindeletecategory/:id', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("delete from Category where ? ",
        {
            Id_Category : req.params.id,
        });

        res.redirect(`/admincategory/${tempidpro}`);
    }
	
})


////////////////////////////////////  Admin Edit Category  ////////////////////////////////////////////////////////

app.get('/admineditcategory/:id', function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from Category inner join Season on Category.Id_Season=Season.Id_Season",function
        (err,rows,field){
            console.log(rows)
        res.render(__dirname + '/views/admineditcategory', 
        {
            Id_Category :req.params.id,
            username : sess.Username,
        });
    })
    }
})


app.post('/updatecategory/:id', url, function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("update Category set ? where ? ",
        [
            {
                Category_Name : req.body.Category_Name,
                Id_Season : req.body.Id_Season,

            },
            {
                Id_Category : req.params.id,
            }
        ]);

        res.redirect(`/admincategory/${tempidpro}`);
    }
	
})

/////////////////////////////////////////////  Admin Product  ///////////////////////////////////////////////////////
var tempidproduct="";

app.get('/adminproduct/:id', function(req, res){
    sess = req.session;
    tempidproduct = req.params.id
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {   
        var sql="select * from Product where Id_Category = ?"
        connection.query(sql,[req.params.id], function(err,rows,field)
        {
        var sql2="select * from Category inner join Season on Category.Id_Season=Season.Id_Season where Id_Category = ?"
        connection.query(sql2,[req.params.id],function(err2,rows2)
        {
            console.log(rows2)

            res.render("adminproduct", 
            {
                data: rows,
                data2: rows2,
                username : sess.Username
            });
        })
        })
    }
})

/////////////////////////////////////////////////////  Admin Insert Product  /////////////////////////////////////////////////

app.get('/admininsertproduct/:id', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from Category where Id_Category = ?",[req.params.id],function(err,rows){
            console.log(rows)
        
        res.render("admininsertproduct",
        {
            data: rows,
            username : sess.Username
        
        });
    })
    }
})

app.post('/admininsertproduct', url, function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("insert into Product set ? ",
        {
            Product_Name : req.body.Product,
            Price : req.body.Price,
            Id_Category : req.body.Id_Category

        });
    
        res.redirect(`/adminproduct/${tempidproduct}`);
    }
})

/////////////////////////////////////////////////  Admin Delete Product  ///////////////////////////////////////////////////

app.get('/admindeleteproduct/:id', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("delete from Product where ? ",
        {
            Id_Product : req.params.id,
        });

        res.redirect(`/adminproduct/${tempidproduct}`);
    }
	
})

////////////////////////////////////////////////  Admin Edit Product  ///////////////////////////////////////////////////////

app.get('/admineditproduct/:id', function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from Product inner join Category on Product.Id_Category=Category.Id_Category where Id_Product = ?",[req.params.id],function(err,rows){
        
            console.log(rows)
        res.render(__dirname + '/views/admineditproduct', 
        {
            data : rows,
            username : sess.Username,
        });
    })
    }
})


app.post('/admineditproduct/:id', url, function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("update Product set ? where ? ",
        [
            {
                Product_Name : req.body.product,
                Price : req.body.price,
                Id_Category : req.body.Id_Category,

            },
            {
                Id_Product : req.params.id,
            }
        ]);

        res.redirect(`/adminproduct/${tempidproduct}`);
    }
	
})


////////////////////////////////////////////////////  Admin Product Detail  ///////////////////////////////////////////

var tempiddetail="";
app.get('/adminproductdetail/:id', function(req,res)
{
    sess = req.session;
    tempiddetail=req.params.id;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {   
        var sql="select * from Product where Id_Product = ?"
        connection.query(sql,[req.params.id], function(err,rows,field)
        {
        var sql2="select * from ProductSize inner join ProductColor on ProductSize.Id_ProductColor=ProductColor.Id_ProductColor where Id_Product = ?"
        connection.query(sql2,[req.params.id],function(err2,rows2)
        {
            // console.log(rows)
            // res.json(rows2)
            res.render("adminproductdetail", 
            {
                data : rows,
                data2 : rows2,
                username : sess.Username
            })
        })
        
    })
}})

////////////////////////////////////////////  Admin Insert Product Detail  ///////////////////////////////////////////////////

app.get('/admininsertproductdetail/:id', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from Product where Id_Product = ?",[req.params.id],function(err,rows){
            connection.query("select * from ProductSize inner join ProductColor on ProductSize.Id_ProductColor=ProductColor.Id_ProductColor where Id_Product = ?",[req.params.id],function(err,rows2){
        
            res.render("admininsertproductdetail",
                {
                    data : rows,
                    data2 : rows2,
                    username : sess.Username
                });
            })
        })
    }
})

app.post('/admininsertproductdetail', url, function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("insert into ProductColor set ? ",
        {
            Id_Product : req.body.Id_Product,
            Color : req.body.Color,
            
        });
        connection.query("insert into ProductSize set ? ",
        {
            Id_Color : req.body.Id_Color,
            Size : req.body.Size,
            Stock : req.body.Stock

        });
        res.redirect(`/adminproductdetail/${tempiddetail}`);
    }
})

//////////////////////////////////////////////  Admin Delete Product Detail  /////////////////////////////////////////////////

app.get('/admindeleteproductdetail/:idsize', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("delete from ProductSize where ? ",
        {
            Id_Size : req.params.idsize,
        });

        res.redirect(`/adminproductdetail/${tempiddetail}`);
    }
	
})

////////////////////////////////////////  Admin Edit Product Detail  //////////////////////////////////////////////////////////

app.get('/admineditproductdetail/:idz', function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from ProductSize inner join ProductColor on ProductSize.Id_ProductColor=ProductColor.Id_ProductColor where Id_ProductSize = ?",[req,params.idz], function
        (err,rows){
            //console.log(rows)
            //console.log("hello")
        res.render(__dirname + '/views/admineditproductdetail', 
        {
            data : rows,
            username : sess.Username,
        });
    })
    }
})


app.post('/admineditproductdetail/:idcolor/:idsize', url, function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("update ProductColor set ? where ? ",
        [
            {
                Id_Product : req.body.Id_Product,
                Color_Name : req.body.Color_Name,

            },
            {
                Id_Color : req.params.Id_Color,
            }
        ]);
        connection.query("update ProductSize set ? where ? ",
        [
            {
                Id_Color : req.body.Id_Color,
                Size : req.body.Size,
                Stock : req.body.Stock

            },
            {
                Id_Size : req.params.Id_Size,
            }
        ]);

        res.redirect(`/adminproductdetail/${tempiddetail}`);
    }
	
})



////////////////////////////////////////////////  ADMIN INSERT COLOR AND SIZE  ////////////////////////////////////////

app.get('/admininsertcolorandsize/:id', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from Product where Id_Product = ?",[req.params.id],function(err,rows){
            connection.query("select * from ProductSize inner join ProductColor on ProductSize.Id_ProductColor=ProductColor.Id_ProductColor where Id_Product = ?",[req.params.id],function(err,rows2){
                connection.query("select * from ProductColor", function(err,rows3){
                    console.log(rows3)

            res.render("admininsertcolorandsize",
                {
                    data : rows,
                    data2 : rows2,
                    data3 : rows3,
                    username : sess.Username
                });
            })
        })
        })
    }
})

app.post('/admininsertcolorandsize', url, function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("insert into ProductColor set ? ",
        {
            Id_Product : req.body.Id_Product,
            Color : req.body.Color,
            
        });
        connection.query("insert into ProductSize set ? ",
        {
            Id_Color : req.body.Id_Color,
            Size : req.body.Size,
            Stock : req.body.Stock

        });
        res.redirect(`/adminproductdetail/${tempiddetail}`);
    }
})


///////////////////////////////////////////  ADMIN DELETE SIZE  ///////////////////////////////////////////

app.get('/admindeletesize/:idsize', function(req, res)
{
    sess = req.session;
    if (sess.userid==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("delete from ProductSize where ? ",
        {
            Id_Size : req.params.idsize,
        });

        res.redirect(`/adminproductdetail/${tempiddetail}`);
    }
	
})





////////////////////////////////////////////////  ADMIN EDIT SIZE  ///////////////////////////////////////////

app.get('/admineditsize/:idz', function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("select * from ProductSize inner join ProductColor on ProductSize.Id_ProductColor=ProductColor.Id_ProductColor where Id_ProductSize = ?",[req,params.idz], function
        (err,rows){
            //console.log(rows)
            //console.log("hello")
        res.render('admineditsize', 
        {
            data : rows,
            username : sess.Username,
        });
    })
    }
})


app.post('/admineditsize/:idcolor/:idsize', url, function(req, res)
{
    sess = req.session;
    if (sess.id==null)
    {
        res.redirect('/admin');
    }
    else
    {
        connection.query("update ProductColor set ? where ? ",
        [
            {
                Id_Product : req.body.Id_Product,
                Color_Name : req.body.Color_Name,

            },
            {
                Id_Color : req.params.Id_Color,
            }
        ]);
        connection.query("update ProductSize set ? where ? ",
        [
            {
                Id_Color : req.body.Id_Color,
                Size : req.body.Size,
                Stock : req.body.Stock

            },
            {
                Id_Size : req.params.Id_Size,
            }
        ]);

        res.redirect(`/adminproductdetail/${tempiddetail}`);
    }
	
})


//////////////////////////////////////////////  LOG OUT USER  /////////////////////////////////////////////////


app.get('/logoutuser',function(req,res)
{
    req.session.destroy(function(err) 
    {
        if(err) 
        {
            console.log(err);
        } 
        else {
            res.redirect('/login');
        }
    });
});

app.get('/logout',function(req,res)
{
    req.session.destroy(function(err) 
    {
        if(err) 
        {
            console.log(err);
        } 
        else {
            res.redirect('/admin');
        }
    });
});


app.listen(3001);
