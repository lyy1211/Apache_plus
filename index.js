let http=require('http');
let path=require('path');
let fs=require('fs');
const mime = require('mime');
let rootpath=path.join(__dirname,'www');
let querystring=require('querystring');
// console.log(rootpath);
http.createServer((request,response)=>{
    console.log('请求过来了');
    let filepath=path.join(rootpath,querystring.unescape(request.url));
    console.log(filepath);
    // console.log(request.url);
    // response.end(`you come`);
    let isexist=fs.existsSync(filepath);
    if(isexist){
        fs.readdir(filepath,(err,files)=>{
            //如果是文件
            if(err){
                // console.log(err);
                fs.readFile(filepath,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        response.writeHead(200,{
                            'content-type':mime.getType(filepath)
                        })
                        response.end(data);
                    }
                })
            }else{
                console.log(files);
                if(files.indexOf('index.html')!=-1){
                    fs.readFile(path.join(filepath,'index.html'),(err,data)=>{
                        if(err){
                            console.log(err);
                        }else{
                            response.end(data);
                        }
                    })
                    return;
                }else{
                    let backData = '';
                    for(let i =0;i<files.length;i++){
                        backData+=`<h2><a href="${request.url=='/'?'':request.url}/${files[i]}">${files[i]}</a></h2>`;
                    }
                    response.writeHead(200,{
                        'content-type':'text/html;charset=utf-8'
                    })
                    response.end(backData);

                }
                
                
            }
        })
        
    }else{
        response.writeHead(404,{
            'content-type':'text/html;charset=utf-8'
        })
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>The requested URL /index.html was not found on this server.</p>
        </body></html>
        `);
    }

}).listen(80,'127.0.0.1',()=>{
    console.log('监听成功');
})