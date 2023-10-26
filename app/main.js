const net = require("net");
const fs = require("fs");


const server = net.createServer((socket) => {
    socket.on("close",() => {
        socket.end();
        server.close()
    });

    socket.on("data", (data) => {
      const path = data.toString().split(' ')[1];
      if(path === '/') {
        // RESPOND WITH 200 / RESPOND WITH CONTENT
          socket.write('HTTP/1.1 200 OK\r\n\r\n');
          socket.end();
          return;
      } else if (path.startsWith('/echo')) {
          let randomString = path.split("/echo/")[1];
          socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${randomString.length}\r\n\r\n${randomString}\r\n`);
          socket.end();
          return;
          // PARSE THE HEADER
      } else if (path.startsWith('/user-agent')){
        let userAgent = data.toString().split('\r\n').find((a) => a.startsWith('User-Agent: ')).replace('User-Agent: ', '');
        console.log(userAgent)
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}\r\n`);
        socket.end();
        return;
        // Get a file
      } else if(path.startsWith('/files')) {
        const dirIdx = process.argv.indexOf("--directory") + 1;
        if(dirIdx === 0) {
            socket.end();
            return;
        }
        const filesDir = process.argv[dirIdx];
        const fileName = path.split("/files/")[1];

      // POST FILE
      if(data.toString().split(' ')[0] === 'POST') {
        let body = data.toString().split("\r\n\r\n")[1];
        fs.writeFile(`${filesDir}/${fileName}`, body, () => {
          socket.write('HTTP/1.1 201 Created\r\n\r\n');
          socket.end();
        });
        return;
      }



      // GET FILE
        fs.readFile(`${filesDir}/${fileName}`,'utf-8',(err,content) => {
            if(err){
                socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
                socket.end();
                return;
            }
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`);
            socket.end();
        })
1
        return;
    }

      // RESPOND WITH 404
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.end();

      
      if(data.toString().split(' ')[0] === 'POST') {
        let body = data.toString().split("\r\n\r\n")[1];
        fs.writeFile(`${filesDir}/${fileName}`, body, () => {
            socket.write('HTTP/1.1 201 Created\r\n\r\n');
            socket.end();
        });
        return;
1
    }
    })

  })

  // Multiple connections 
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.error("Address in use, retrying...")
      setTimeout(() => {
        server.close()
        server.listen(PORT, HOST)
      }, 1000)
    }
  1
  })
  
  // Bind a port
  server.listen(4221,"localhost")