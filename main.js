const http = require("http");

const todos = [
    { id: 1, text: 'To Do One'},
    { id: 2, text: 'To Do Two'},
    { id: 3, text: 'To Do Three'},
];

const server = http.createServer((q, s) => {

    const {method, url} = q;
    let body = [];

    q.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        let status = 404;
        const response = {
            success: false,
            result: [],
            error: ''
        };

        if (method === 'GET' && url === '/todos') {
                
            status = 200;
            response.success = true;
            response.result = todos;

        } else if (method === 'POST' && url === '/todos') {

            const {id, text} = JSON.parse(body);

            if (!id || !text){
                status = 400;
                response.error = 'Please add ID and Text';
            } else {
                todos.push({id, text});
                status = 201;
                response.success = true;
                response.result = todos;
            }
        } 
            
        s.writeHead(status, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'Node.js'
        });
        
        s.end(JSON.stringify(response));
    });

});

const port = 5470;
server.listen(port, () => {
    console.log(`[SYSTEM] Connected To ${port}`);
});